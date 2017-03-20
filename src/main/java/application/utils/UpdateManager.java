package application.utils;

import application.objects.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.*;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.Optional;
import java.util.Set;

/**
 * Created by tkopec on 2016-08-18.
 */
public class UpdateManager {
    private Document document;

    public UpdateManager(Document document) {
        this.document = document;
    }

    public String nodeToString(Node node, boolean omitXmlDeclaration, boolean prettyPrint) {
        if (node == null) {
            throw new IllegalArgumentException("node is null.");
        }

        try {
            // Remove unwanted whitespaces
            XPath xpath = XPathFactory.newInstance().newXPath();
            XPathExpression expr = xpath.compile("//text()[normalize-space()='']");
            NodeList nodeList = (NodeList) expr.evaluate(node, XPathConstants.NODESET);

            for (int i = 0; i < nodeList.getLength(); ++i) {
                Node nd = nodeList.item(i);
                nd.getParentNode().removeChild(nd);
            }

            // Create and setup transformer
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            if (omitXmlDeclaration == true) {
                transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            }

            if (prettyPrint == true) {
                transformer.setOutputProperty(OutputKeys.INDENT, "yes");
                transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
            }

            // Turn the node into a string
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(node), new StreamResult(writer));
            return writer.toString();
        } catch (TransformerException e) {
            throw new RuntimeException(e);
        } catch (XPathExpressionException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateOffers(OffersToSave data) {
        NodeList offerIds = document.getElementsByTagName("offerId");

        // set node at offerId which needs to be updated
        Node node = offerIds.item(0);
        int i = 1;
        while (!data.getOfferId().equals(node.getTextContent()))
            node = offerIds.item(i++);

        // find offering with productOfferingId == productId and parent == node
        Node sibling = node.getNextSibling();
        while (!(sibling instanceof Element))
            sibling = sibling.getNextSibling();
        sibling = sibling.getNextSibling();
        while (!(sibling instanceof Element))
            sibling = sibling.getNextSibling();

        // iterate over all offerings and find right offering. Modify productOfferingCode
        NodeList products = sibling.getChildNodes();
        Element productOffering = null;
        for (int j = 0; j < products.getLength(); j++) {
            Node item = products.item(j);
            if (item.getNodeType() == Node.ELEMENT_NODE) {
                productOffering = (Element) item;
                String productOfferingCode = productOffering
                        .getElementsByTagName("productOfferingCode")
                        .item(0)
                        .getTextContent();

                if (productOfferingCode.equals(data.getProductId())) {
                    // replace text node with new content
                    modify("productOfferingCode", productOffering, data.getProductOfferingCode());
                    break;
                }
            }
        }

        // modify productType
        modify("productType", productOffering, data.getProductType());

        // modify productCategories
        modifyCategories(productOffering, data.getProductCategory());

        // modify productMultiplicity
        modify("productMultiplicity", productOffering, data.getProductMultiplicity());

        // modify productOfferingVariant
        modify("productOfferingVariant", productOffering, data.getProductOfferingVariant());

        // modify productOfferingVersion
        modify("productOfferingVersion", productOffering, data.getProductOfferingVersion());

        // modify validFrom
        modify("validFrom", productOffering, data.getValidFrom());

        // modify isRequired
        modify("isRequired", productOffering, data.getIsRequired());

        // modify isProductDiscount
        modify("isProductDiscount", productOffering, data.getIsProductDiscount());

        // modify parameters
        modifyParameters(productOffering, data.getParametersSet());

        // modify subscribingObjectTypes
        modifySot(productOffering, data.getSubscribingObjectTypes());

        // modify salesChannels
        modifySalesChannels(productOffering, data.getSalesChannels());

        // modify prices
        modifyPrices(productOffering, data.getPrices());

        // modify transitions
        modifyTransitions(productOffering, data.getTransitions());
    }

    public void updateCategories(Set<CategoriesToSave> data) {
        Node categories = getNode("productCategories");
        Node types = getNode("productTypes");

        // remove all children
        while (categories.hasChildNodes())
            categories.removeChild(categories.getFirstChild());

        while (types.hasChildNodes())
            types.removeChild(types.getFirstChild());

        // for each item in data create new category
        data.forEach(item -> createNewCategory(item, categories, types, item.isCategory()));
    }

    public void updateAssociations(Set<CategoriesToSave> data) {
        Node associations = document.getElementsByTagName("associations").item(0);

        // remove all associations
        while (associations.hasChildNodes())
            associations.removeChild(associations.getFirstChild());

        data.forEach(item -> treeWalk(item, associations));
    }

    public Document getDocument() {
        return document;
    }

    public void updateOfferings(OfferingsToSave offeringsData) {
        NodeList offers = document.getElementsByTagName("offer");
        // find right offer
        Element offer = getOffer(offers, offeringsData.getOfferId(), offeringsData.getOfferCode());
        NodeList productOfferings = offer.getElementsByTagName("productOffering");
        Node parent = offer.getElementsByTagName("offerings").item(0);

        dataIter(productOfferings, parent, offeringsData.getProductOfferings());
        offeringsIter(offeringsData.getProductOfferings(), parent, productOfferings);
    }

    /**
     * Iterate over DOM and remove items that do not exist in data from client
     *
     * @param productOfferings list of DOM elements
     * @param parent           parent of productOfferings
     * @param offeringsData    data gathered from client
     */
    private void dataIter(NodeList productOfferings, Node parent, Set<OfferingsToSave> offeringsData) {
        for (int i = 0; i < productOfferings.getLength(); i++) {
            Node item = productOfferings.item(i);
            if (item.getParentNode().equals(parent)) {
                String productOfferingId =
                        ((Element) item).getElementsByTagName("productOfferingId").item(0).getTextContent();

                if (offeringsData == null || !dataContains(productOfferingId, offeringsData))
                    parent.removeChild(item);

                NodeList bundledOfferings = ((Element) item).getElementsByTagName("bundledOfferings");
                // if bundle exists
                if (bundledOfferings.getLength() > 0) {
                    Optional<OfferingsToSave> first = offeringsData.stream().filter(x -> productOfferingId.equals(x.getOfferId())).findFirst();

                    if (first.isPresent()) {
                        OfferingsToSave offeringsToSave = first.get();
                        // run recursion on bundle items
                        dataIter(((Element) bundledOfferings.item(0)).getElementsByTagName("productOffering"),
                                bundledOfferings.item(0),
                                offeringsToSave.getProductOfferings());
                    }
                }
            }

        }
    }

    /**
     * Iterate over offerings gathered from client and add to DOM those one that DOM does not contain
     *
     * @param offerings        offerings to operate on
     * @param parent           parent to whom append operation is applied
     * @param productOfferings offerings obtained from DOM
     */
    private void offeringsIter(Set<OfferingsToSave> offerings, Node parent, NodeList productOfferings) {
        offerings.forEach(x -> {
            Node productOffering;
            if ((productOffering = documentContains(productOfferings, x.getOfferId())) == null) {
                Node newOffering = append(x.getOfferId(), x.getOfferCode(), parent);
                if (x.getProductOfferings() != null) {
                    Element bundledOfferings = document.createElement("bundledOfferings");
                    newOffering.appendChild(bundledOfferings);
                    parent.appendChild(newOffering);
                    offeringsIter(x.getProductOfferings(), bundledOfferings, bundledOfferings.getChildNodes());
                }
            } else if (x.getProductOfferings() != null) {
                NodeList bundledOfferings = ((Element) productOffering).getElementsByTagName("bundledOfferings");
                // if bundledOfferings does not exist in existing productOffering
                if (bundledOfferings.getLength() == 0) {
                    Node parentBundledOfferings = productOffering.appendChild(document.createElement("bundledOfferings"));
                    offeringsIter(x.getProductOfferings(), parentBundledOfferings, parentBundledOfferings.getChildNodes());
                } else
                    offeringsIter(x.getProductOfferings(), bundledOfferings.item(0), bundledOfferings.item(0).getChildNodes());
            }

        });
    }

    private Node append(String offerId, String offerCode, Node parent) {
        Element productOffering = document.createElement("productOffering");
        Node productOfferingId = document.createElement("productOfferingId");
        productOfferingId.appendChild(document.createTextNode(offerId));
        Node productOfferingCode = document.createElement("productOfferingCode");
        productOfferingCode.appendChild(document.createTextNode(offerCode));

        productOffering.appendChild(productOfferingId);
        productOffering.appendChild(productOfferingCode);

        parent.appendChild(productOffering);
        return productOffering;
    }

    private Node documentContains(NodeList list, String item) {
        for (int i = 0; i < list.getLength(); i++) {
            if (item.equals(((Element) list.item(i)).getElementsByTagName("productOfferingId").item(0).getTextContent()))
                return list.item(i);
        }
        return null;
    }

    private boolean dataContains(String offerId, Set<OfferingsToSave> offerings) {
        return offerings.stream().anyMatch(x -> x.getOfferId().equals(offerId));
    }

    private Element getOffer(NodeList productOfferings, String offerId, String offerCode) {
        for (int i = 0; i < productOfferings.getLength(); i++) {
            Element item = (Element) productOfferings.item(i);
            if (item.getElementsByTagName("offerId").item(0).getTextContent().equals(offerId) &&
                    item.getElementsByTagName("offerCode").item(0).getTextContent().equals(offerCode))
                return item;
        }
        return null;
    }

    private void treeWalk(CategoriesToSave item, Node associationsNode) {
        item.getAssociations().forEach(association -> createAssociation(
                item.getId(),
                item.isCategory(),
                association,
                associationsNode));

        // go deeper
        item.getChildren().forEach(child -> treeWalk(child, associationsNode));
    }

    private void createAssociation(String entity1, boolean isCategory, String entity2, Node associationsNode) {
        Node association = associationsNode.appendChild(document.createElement("association"));

        Node associationType = document.createElement("associationType");
        associationType.appendChild(document.createTextNode(entity2.substring(0, 1)));
        association.appendChild(associationType);

        Node node1;
        Node node2;
        // check if second entity is type or category
        if (isCategory) {
            node1 = document.createElement("productCategoryId1");
            node1.appendChild(document.createTextNode(entity1));

            // check what is the type of first entity
            if (entity2.charAt(1) == 'c' || entity2.charAt(1) == 'C') {
                association.appendChild(document.createElement("productTypeId1"));
                association.appendChild(document.createElement("productTypeId2"));
                node2 = document.createElement("productCategoryId2");
                node2.appendChild(document.createTextNode(entity2.substring(2)));
                association.appendChild(node1);
                association.appendChild(node2);
            } else {
                association.appendChild(document.createElement("productTypeId1"));
                node2 = document.createElement("productTypeId2");
                node2.appendChild(document.createTextNode(entity2.substring(2)));
                association.appendChild(node2);
                association.appendChild(node1);
                association.appendChild(document.createElement("productCategoryId2"));
            }
        } else {
            node1 = document.createElement("productTypeId1");
            node1.appendChild(document.createTextNode(entity1));

            // check what is the type of first entity
            if (entity2.charAt(1) == 'c' || entity2.charAt(1) == 'C') {
                association.appendChild(node1);
                association.appendChild(document.createElement("productTypeId2"));
                association.appendChild(document.createElement("productCategoryId1"));
                node2 = document.createElement("productCategoryId2");
                node2.appendChild(document.createTextNode(entity2.substring(2)));
                association.appendChild(node2);
            } else {
                node2 = document.createElement("productTypeId2");
                node2.appendChild(document.createTextNode(entity2.substring(2)));
                association.appendChild(node1);
                association.appendChild(node2);
                association.appendChild(document.createElement("productCategoryId1"));
                association.appendChild(document.createElement("productCategoryId2"));
            }
        }
    }

    private void createNewCategory(CategoriesToSave item, Node categories, Node types, boolean isCategory) {
        if (isCategory) {
            // create new category
            Node productCategory = categories.appendChild(document.createElement("productCategory"));
            createElement("productCategoryName", productCategory, item.getName());
            createElement("productCategoryId", productCategory, item.getId());
            Node productCategoryItems = productCategory.appendChild(document.createElement("productCategoryItems"));

            // append productCategoryItems
            item.getChildren().forEach(child -> {
                Element productId;

                if (!child.isCategory())
                    productId = document.createElement("productTypeId");
                else
                    productId = document.createElement("productCategoryId");

                // create new category or new type
                createNewCategory(child, categories, types, child.isCategory());

                productId.appendChild(document.createTextNode(child.getId()));
                productCategoryItems.appendChild(productId);
            });
        } else if (!typeExists(item.getName(), item.getId(), types)) {
            // create new type
            Node productType = types.appendChild(document.createElement("productType"));
            createElement("productTypeName", productType, item.getName());
            createElement("productTypeId", productType, item.getId());
        }
    }

    private boolean typeExists(String name, String id, Node types) {
        NodeList productType = ((Element) types).getElementsByTagName("productType");

        for (int i = 0; i < productType.getLength(); i++) {
            String productTypeName = ((Element) productType.item(i)).getElementsByTagName("productTypeName").item(0).getTextContent();
            String productTypeId = ((Element) productType.item(i)).getElementsByTagName("productTypeId").item(0).getTextContent();

            if (name.equals(productTypeName) && id.equals(productTypeId))
                return true;
        }

        return false;
    }

    private void createElement(String property, Node parent, String newText) {
        Element element = document.createElement(property);
        if (newText != null)
            element.appendChild(document.createTextNode(newText));
        else
            element.appendChild(document.createTextNode("NULL"));

        parent.appendChild(element);
    }

    private Node getNode(String target) {
        NodeList allNodes = document.getElementsByTagName(target);

        // find categories listing (omit productCategories in offerings)
        for (int i = 0; i < allNodes.getLength(); i++) {
            Node node = allNodes.item(i);
            if ("return".equals(node.getParentNode().getNodeName()))
                return node;
        }

        return null;
    }

    private void modify(String parameter, Element productOffering, String newTextContent) {
        Node parameterNode = productOffering.getElementsByTagName(parameter).item(0);
        parameterNode.replaceChild(
                document.createTextNode(newTextContent),
                parameterNode.getFirstChild()
        );
    }

    private void modifyCategories(Element productOffering, Set<String> categoriesSet) {
        Node categories = productOffering.getElementsByTagName("productCategories").item(0);

        // remove old parameters
        while (categories.hasChildNodes())
            categories.removeChild(categories.getFirstChild());

        // get iterator of new data to insert
        Iterator<String> newProductCategories = categoriesSet.iterator();
        for (int j = 0; j < categoriesSet.size(); j++)
            categories.appendChild(createNewElement("productCategory", newProductCategories.next()));
    }

    private void modifyParameters(Element productOffering, Set<Parameter> parametersSet) {
        Node parameters = productOffering.getElementsByTagName("parameters").item(0);

        // remove old parameters
        while (parameters.hasChildNodes())
            parameters.removeChild(parameters.getFirstChild());

        Iterator<Parameter> parameterIterator = parametersSet.iterator();
        // append new parameters
        for (int j = 0; j < parametersSet.size(); j++) {
            Element parameter = document.createElement("parameter");
            Parameter next = parameterIterator.next();

            parameter.appendChild(createNewElement("parameterName", next.getParameterName()));

            parameter.appendChild(createNewElement("parameterValue", next.getParameterValue()));

            parameter.appendChild(createNewElement("parameterType", next.getParameterType()));

            parameters.appendChild(parameter);
        }
    }

    private void modifySot(Element productOffering, Set<String> subscribingObjectTypesSet) {
        Node subscribingObjectTypes = productOffering.getElementsByTagName("subscribingObjectTypes").item(0);

        // remove old sot
        while (subscribingObjectTypes.hasChildNodes())
            subscribingObjectTypes.removeChild(subscribingObjectTypes.getFirstChild());

        Iterator<String> sotIterator = subscribingObjectTypesSet.iterator();
        // append new sot
        for (int j = 0; j < subscribingObjectTypesSet.size(); j++)
            subscribingObjectTypes.appendChild(createNewElement("subscribingObjectType", sotIterator.next()));
    }

    private void modifySalesChannels(Element productOffering, Set<String> salesChannelsSet) {
        Node salesChannels = productOffering.getElementsByTagName("salesChannels").item(0);

        // remove old parameters
        while (salesChannels.hasChildNodes())
            salesChannels.removeChild(salesChannels.getFirstChild());

        Iterator<String> salesChannelsIterator = salesChannelsSet.iterator();
        // append new parameters
        for (int j = 0; j < salesChannelsSet.size(); j++) {
            Element salesChannel = document.createElement("salesChannel");
            String next = salesChannelsIterator.next();

            salesChannel.appendChild(createNewElement("salesChannelCode", next));

            salesChannel.appendChild(createNewElement("salesChannelId", ""));

            salesChannels.appendChild(salesChannel);
        }
    }

    private void modifyPrices(Element productOffering, Set<Price> pricesSet) {
        NodeList allPrices = productOffering.getElementsByTagName("prices");

        // find prices of offering, omit 'prices' tag in transitions by inspecting parentNode
        Node prices = null;
        for (int i = 0; i < allPrices.getLength(); i++) {
            prices = allPrices.item(i);
            if (prices.getParentNode().equals(productOffering))
                break;
        }

        //remove old values
        while (prices.hasChildNodes())
            prices.removeChild(prices.getFirstChild());

        // append new values
        Iterator<Price> iteratorPrices = pricesSet.iterator();
        for (int i = 0; i < pricesSet.size(); i++) {
            Element price = document.createElement("price");
            Price next = iteratorPrices.next();

            price.appendChild(createNewElement("priceId", ""));
            price.appendChild(createNewElement("priceMode", next.getPriceMode()));
            price.appendChild(createNewElement("priceType", next.getPriceType()));
            price.appendChild(createNewElement("priceTypeDesc", next.getPriceTypeDescription()));
            price.appendChild(createNewElement("priceDescription", next.getPriceDescription()));
            price.appendChild(createNewElement("tax", next.getTax()));
            price.appendChild(createNewElement("currency", next.getCurrency()));
            price.appendChild(createNewElement("amount", next.getAmount()));

            prices.appendChild(price);
        }
    }

    private void modifyTransitions(Element productOffering, Set<Transition> transitionsSet) {
        Node allTransitions = productOffering.getElementsByTagName("transitions").item(0);

        // remove old values
        while (allTransitions.hasChildNodes())
            allTransitions.removeChild(allTransitions.getFirstChild());

        // append new values
        Iterator<Transition> transitionIterator = transitionsSet.iterator();
        for (int i = 0; i < transitionsSet.size(); i++) {
            Element transition = document.createElement("transition");
            Transition next = transitionIterator.next();

            transition.appendChild(createNewElement("transitionType", next.getTransitionType()));

            Element prices = document.createElement("prices");

            // append new prices
            Set<Price> priceSet = next.getPrices();
            Iterator<Price> priceIterator = priceSet.iterator();
            for (int j = 0; j < priceSet.size(); j++) {
                Element price = document.createElement("price");
                Price priceData = priceIterator.next();

                price.appendChild(createNewElement("priceId", ""));
                price.appendChild(createNewElement("priceMode", priceData.getPriceMode()));
                price.appendChild(createNewElement("priceType", priceData.getPriceType()));
                price.appendChild(createNewElement("priceTypeDesc", priceData.getPriceTypeDescription()));
                price.appendChild(createNewElement("priceDescription", priceData.getPriceDescription()));
                price.appendChild(createNewElement("tax", priceData.getTax()));
                price.appendChild(createNewElement("currency", priceData.getCurrency()));
                price.appendChild(createNewElement("amount", priceData.getAmount()));

                prices.appendChild(price);
            }

            transition.appendChild(prices);
            allTransitions.appendChild(transition);
        }
    }

    private Element createNewElement(String tagName, String textContent) {
        Element newElement = document.createElement(tagName);
        newElement.appendChild(document.createTextNode(textContent));

        return newElement;
    }

}
