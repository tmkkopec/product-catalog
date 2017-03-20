package application.handlers;

import application.objects.Parameter;
import application.objects.Price;
import application.objects.ProductDetails;
import application.objects.Transition;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.util.HashSet;
import java.util.Set;

public class ProductHandler extends DefaultHandler {
    private boolean isSelectedOffer = false;
    private boolean isSelectedProduct = false;
    private boolean bOfferId = false;
    private boolean bProductOfferingId = false;

    private boolean bProductOfferingCode = false;
    private boolean bProductType = false;
    private boolean bProductCategories = false;
    private boolean bProductCategory = false;
    private boolean bProductMultiplicity = false;
    private boolean bProductOfferingVariant = false;
    private boolean bProductOfferingVersion = false;
    private boolean bValidFrom = false;
    private boolean bIsRequired = false;
    private boolean bIsProductDiscount = false;

    private boolean bParameterName = false;
    private boolean bParameterValue = false;
    private boolean bParameterType = false;

    private boolean bSubscribingObjectTypes = false;
    private boolean bSubscribingObjectTypeName = false;

    private boolean bSalesChannels = false;
    private boolean bSalesChannelCode = false;

    private boolean bTransitionType = false;
    private boolean bTransitions = false;

    private boolean bPriceMode = false;
    private boolean bPriceType = false;
    private boolean bPriceTypeDescription = false;
    private boolean bPriceDescription = false;
    private boolean bTax = false;
    private boolean bCurrency = false;
    private boolean bAmount = false;

    private boolean bInsideBundle = false;

    private ProductDetails product = null;
    private Set<String> categories = new HashSet<String>();
    private String offerId;
    private String productId;
    private Parameter parameter = null;
    private Transition transition = null;
    private Price price = null;

    public ProductHandler(String offerId, String productId) {
        this.offerId = offerId;
        this.productId = productId;
    }

    public ProductDetails getProduct() {
        return product;
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (bOfferId) {
            String str = new String(ch, start, length);
            if (str.equals(offerId)) {
                isSelectedOffer = true;
            }
            bOfferId = false;
        } else if (bProductOfferingId) {
            String str = new String(ch, start, length);
            if (str.equals(productId)) {
                isSelectedProduct = true;
                product.addGeneral("productOfferingId", new String(ch, start, length));
            } else if (!product.getGenerals().containsKey("productOfferingCode")) {
                product = null;
            }
            bProductOfferingId = false;
        } else if (bProductOfferingCode) {
            product.addGeneral("productOfferingCode", new String(ch, start, length));
            bProductOfferingCode = false;
        } else if (bProductType) {
            product.addGeneral("productType", new String(ch, start, length));
            bProductType = false;
        } else if (bProductCategory) {
            categories.add(new String(ch, start, length));
            bProductCategory = false;
        } else if (bProductMultiplicity) {
            product.addGeneral("productMultiplicity", new String(ch, start, length));
            bProductMultiplicity = false;
        } else if (bProductOfferingVariant) {
            product.addGeneral("productOfferingVariant", new String(ch, start, length));
            bProductOfferingVariant = false;
        } else if (bProductOfferingVersion) {
            product.addGeneral("productOfferingVersion", new String(ch, start, length));
            bProductOfferingVersion = false;
        } else if (bValidFrom) {
            product.addGeneral("validFrom", new String(ch, start, length));
            bValidFrom = false;
        } else if (bIsRequired) {
            product.addGeneral("isRequired", new String(ch, start, length));
            bIsRequired = false;
        } else if (bIsProductDiscount) {
            product.addGeneral("isProductDiscount", new String(ch, start, length));
            bIsProductDiscount = false;
        } else if (bParameterName) {
            parameter = new Parameter();
            parameter.setParameterName(new String(ch, start, length));
            bParameterName = false;
        } else if (bParameterValue) {
            parameter.setParameterValue(new String(ch, start, length));
            bParameterValue = false;
        } else if (bParameterType) {
            parameter.setParameterType(new String(ch, start, length));
            product.addParameter(parameter);
            bParameterType = false;
        } else if (bSubscribingObjectTypeName) {
            product.addSubscribingObjectType(new String(ch, start, length));
            bSubscribingObjectTypeName = false;
        } else if (bSalesChannelCode) {
            product.addSalesChannel(new String(ch, start, length));
            bSalesChannelCode = false;
        } else if (bTransitionType) {
            transition = new Transition();
            transition.setTransitionType(new String(ch, start, length));
            bTransitionType = false;
        } else if (bPriceMode) {
            price = new Price();
            price.setPriceMode(new String(ch, start, length));
            bPriceMode = false;
        } else if (bPriceType) {
            price.setPriceType(new String(ch, start, length));
            bPriceType = false;
        } else if (bPriceTypeDescription) {
            price.setPriceTypeDescription(new String(ch, start, length));
            bPriceTypeDescription = false;
        } else if (bPriceDescription) {
            price.setPriceDescription(new String(ch, start, length));
            bPriceDescription = false;
        } else if (bTax) {
            price.setTax(new String(ch, start, length));
            bTax = false;
        } else if (bCurrency) {
            price.setCurrency(new String(ch, start, length));
            bCurrency = false;
        } else if (bAmount) {
            price.setAmount(new String(ch, start, length));
            if (bTransitions) transition.addPrice(price);
            else product.addPrice(price);
            bAmount = false;
        }
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (qName.equalsIgnoreCase("offerId"))
            bOfferId = true;
        if ((qName.equalsIgnoreCase("productOfferingId")) && isSelectedOffer)
            bProductOfferingId = true;
        if ((qName.equalsIgnoreCase("bundledOfferings")) && isSelectedProduct)
            bInsideBundle = true;
        if ((qName.equalsIgnoreCase("productOfferingCode")) && isSelectedProduct && !bInsideBundle)
            bProductOfferingCode = true;
        if ((qName.equalsIgnoreCase("productType")) && isSelectedProduct && !bInsideBundle)
            bProductType = true;
        if ((qName.equalsIgnoreCase("productCategories")) && isSelectedProduct && !bInsideBundle)
            bProductCategories = true;
        if ((qName.equalsIgnoreCase("productCategory")) && isSelectedProduct && !bInsideBundle)
            bProductCategory = true;
        if ((qName.equalsIgnoreCase("productMultiplicity")) && isSelectedProduct && !bInsideBundle)
            bProductMultiplicity = true;
        if ((qName.equalsIgnoreCase("productOfferingVariant")) && isSelectedProduct && !bInsideBundle)
            bProductOfferingVariant = true;
        if ((qName.equalsIgnoreCase("productOfferingVersion")) && isSelectedProduct && !bInsideBundle)
            bProductOfferingVersion = true;
        if ((qName.equalsIgnoreCase("validFrom")) && isSelectedProduct && !bInsideBundle)
            bValidFrom = true;
        if ((qName.equalsIgnoreCase("isRequired")) && isSelectedProduct && !bInsideBundle)
            bIsRequired = true;
        if ((qName.equalsIgnoreCase("isProductDiscount")) && isSelectedProduct && !bInsideBundle)
            bIsProductDiscount = true;
        if ((qName.equalsIgnoreCase("parameterName")) && isSelectedProduct && !bInsideBundle)
            bParameterName = true;
        if ((qName.equalsIgnoreCase("parameterValue")) && isSelectedProduct && !bInsideBundle)
            bParameterValue = true;
        if ((qName.equalsIgnoreCase("parameterType")) && isSelectedProduct && !bInsideBundle)
            bParameterType = true;
        if (qName.equalsIgnoreCase("subscribingObjectTypes") && !bInsideBundle) {
            if (product == null) product = new ProductDetails();
            bSubscribingObjectTypes = true;
        }
        if ((qName.equalsIgnoreCase("subscribingObjectType")) && bSubscribingObjectTypes && !bInsideBundle)
            bSubscribingObjectTypeName = true;
        if ((qName.equalsIgnoreCase("salesChannels")) && isSelectedProduct && !bInsideBundle)
            bSalesChannels = true;
        if ((qName.equalsIgnoreCase("salesChannelCode")) && isSelectedProduct && bSalesChannels && !bInsideBundle)
            bSalesChannelCode = true;
        if ((qName.equalsIgnoreCase("transition")) && isSelectedProduct && !bInsideBundle)
            bTransitions = true;
        if ((qName.equalsIgnoreCase("transitionType")) && isSelectedProduct && !bInsideBundle)
            bTransitionType = true;
        if ((qName.equalsIgnoreCase("priceMode")) && isSelectedProduct && !bInsideBundle)
            bPriceMode = true;
        if ((qName.equalsIgnoreCase("priceType")) && isSelectedProduct && !bInsideBundle)
            bPriceType = true;
        if ((qName.equalsIgnoreCase("priceTypeDesc")) && isSelectedProduct && !bInsideBundle)
            bPriceTypeDescription = true;
        if ((qName.equalsIgnoreCase("priceDescription")) && isSelectedProduct && !bInsideBundle)
            bPriceDescription = true;
        if ((qName.equalsIgnoreCase("tax")) && isSelectedProduct && !bInsideBundle)
            bTax = true;
        if ((qName.equalsIgnoreCase("currency")) && isSelectedProduct && !bInsideBundle)
            bCurrency = true;
        if ((qName.equalsIgnoreCase("amount")) && isSelectedProduct && !bInsideBundle)
            bAmount = true;
    }

    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equalsIgnoreCase("productOffering") && isSelectedProduct) {
            isSelectedProduct = false;
            isSelectedOffer = false;
        }
        if (qName.equalsIgnoreCase("bundledOfferings") && bInsideBundle) {
            bInsideBundle = false;
        }
        if (qName.equalsIgnoreCase("subscribingObjectTypes") && bSubscribingObjectTypes) {
            bSubscribingObjectTypes = false;
        }
        if (qName.equalsIgnoreCase("salesChannels") && isSelectedProduct && bSalesChannels) {
            bSalesChannels = false;
        }
        if (qName.equalsIgnoreCase("productCategories") && isSelectedProduct && bProductCategories) {
            product.addGeneral("productCategory", categories);
            bSalesChannels = false;
        }
        if (qName.equalsIgnoreCase("transition") && isSelectedProduct && bTransitions) {
            product.addTransition(transition);
            bTransitions = false;
        }
    }
}