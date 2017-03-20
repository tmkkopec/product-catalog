package application.handlers;

import application.objects.Offer;
import application.objects.Price;
import application.objects.Product;
import application.objects.Transition;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.util.HashSet;
import java.util.Set;

public class ScrollHandler extends DefaultHandler {
    private boolean bOfferId = false;
    private boolean bOfferCode = false;
    private boolean bProductOfferingId = false;
    private boolean bProductOfferingCode = false;
    private boolean bProductType = false;
    private boolean bProductCategories = false;
    private boolean bProductCategory = false;
    private boolean bProductOfferingVariant = false;
    private boolean bProductOfferingVersion = false;
    private boolean bValidFrom = false;

    private boolean bTransitionType = false;
    private boolean bTransitions = false;

    private boolean bPriceMode = false;
    private boolean bPriceType = false;
    private boolean bPriceTypeDescription = false;
    private boolean bPriceDescription = false;
    private boolean bTax = false;
    private boolean bCurrency = false;
    private boolean bAmount = false;

    private boolean bBundledOffering = false;
    private boolean isSelectedOffer = false;
    private Product product = null;
    private Offer offer = null;
    private Product bundled = null;
    private String offerId;
    private Transition transition = null;
    private Price price = null;
    private Set<String> categories = new HashSet<String>();

    public ScrollHandler(String offerId) {
        this.offerId = offerId;
    }

    public Offer getOffer() {
        return offer;
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (bOfferId) {
            String str = new String(ch, start, length);
            if ((str.equals(offerId))) {
                isSelectedOffer = true;
                offer = new Offer();
                offer.setOfferId(str);
            }
            bOfferId = false;
        } else if (bOfferCode) {
            offer.setOfferCode(new String(ch, start, length));
            bOfferCode = false;
        } else if (bProductOfferingId) {
            if (bBundledOffering) {
                bundled = new Product();
                bundled.setProductOfferingId(new String(ch, start, length));
                bundled.addGeneral("productOfferingId", new String(ch, start, length));
            } else {
                product = new Product();
                product.setProductOfferingId(new String(ch, start, length));
                product.addGeneral("productOfferingId", new String(ch, start, length));
            }
            bProductOfferingId = false;
        } else if (bProductOfferingCode) {
            if (bBundledOffering) {
                bundled.setProductOfferingCode(new String(ch, start, length));
                bundled.addGeneral("productOfferingCode", new String(ch, start, length));
            } else {
                product.setProductOfferingCode(new String(ch, start, length));
                product.addGeneral("productOfferingCode", new String(ch, start, length));
            }
            bProductOfferingCode = false;
        } else if (bProductType) {
            if (bBundledOffering) bundled.addGeneral("productType", new String(ch, start, length));
            else product.addGeneral("productType", new String(ch, start, length));
            bProductType = false;
        } else if (bProductCategory) {
            categories.add(new String(ch, start, length));
            bProductCategory = false;
        } else if (bProductOfferingVariant) {
            if (bBundledOffering) bundled.addGeneral("productOfferingVariant", new String(ch, start, length));
            else product.addGeneral("productOfferingVariant", new String(ch, start, length));
            bProductOfferingVariant = false;
        } else if (bProductOfferingVersion) {
            if (bBundledOffering) bundled.addGeneral("productOfferingVersion", new String(ch, start, length));
            else product.addGeneral("productOfferingVersion", new String(ch, start, length));
            bProductOfferingVersion = false;
        } else if (bValidFrom) {
            if (bBundledOffering) bundled.addGeneral("validFrom", new String(ch, start, length));
            else product.addGeneral("validFrom", new String(ch, start, length));
            bValidFrom = false;
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
        if (qName.equalsIgnoreCase("offerCode") && isSelectedOffer)
            bOfferCode = true;
        if (qName.equalsIgnoreCase("bundledOfferings") && isSelectedOffer)
            bBundledOffering = true;
        if (qName.equalsIgnoreCase("productOfferingId") && isSelectedOffer)
            bProductOfferingId = true;
        if (qName.equalsIgnoreCase("productOfferingCode") && isSelectedOffer)
            bProductOfferingCode = true;
        if ((qName.equalsIgnoreCase("productType")) && isSelectedOffer)
            bProductType = true;
        if ((qName.equalsIgnoreCase("productCategories")) && isSelectedOffer) {
            bProductCategories = true;
            categories = new HashSet<String>();
        }
        if ((qName.equalsIgnoreCase("productCategory")) && isSelectedOffer)
            bProductCategory = true;
        if ((qName.equalsIgnoreCase("productOfferingVariant")) && isSelectedOffer)
            bProductOfferingVariant = true;
        if ((qName.equalsIgnoreCase("productOfferingVersion")) && isSelectedOffer)
            bProductOfferingVersion = true;
        if ((qName.equalsIgnoreCase("validFrom")) && isSelectedOffer)
            bValidFrom = true;
        if ((qName.equalsIgnoreCase("transition")) && isSelectedOffer)
            bTransitions = true;
        if ((qName.equalsIgnoreCase("transitionType")) && isSelectedOffer)
            bTransitionType = true;
        if ((qName.equalsIgnoreCase("priceMode")) && isSelectedOffer)
            bPriceMode = true;
        if ((qName.equalsIgnoreCase("priceType")) && isSelectedOffer)
            bPriceType = true;
        if ((qName.equalsIgnoreCase("priceTypeDesc")) && isSelectedOffer)
            bPriceTypeDescription = true;
        if ((qName.equalsIgnoreCase("priceDescription")) && isSelectedOffer)
            bPriceDescription = true;
        if ((qName.equalsIgnoreCase("tax")) && isSelectedOffer)
            bTax = true;
        if ((qName.equalsIgnoreCase("currency")) && isSelectedOffer)
            bCurrency = true;
        if ((qName.equalsIgnoreCase("amount")) && isSelectedOffer)
            bAmount = true;
    }

    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equalsIgnoreCase("offer") && isSelectedOffer)
            isSelectedOffer = false;
        if (qName.equalsIgnoreCase("bundledOfferings") && isSelectedOffer) {
            product.setIsBundle(true);
            bBundledOffering = false;
        }
        if (qName.equalsIgnoreCase("productCategories") && isSelectedOffer && bProductCategories) {
            if (bBundledOffering) bundled.addGeneral("productCategory", categories);
            else product.addGeneral("productCategory", categories);
        }
        if (qName.equalsIgnoreCase("productOffering") && isSelectedOffer) {
            if (bBundledOffering) product.addProduct(bundled);
            else offer.addProduct(product);
        }
        if (qName.equalsIgnoreCase("transition") && isSelectedOffer && bTransitions) {
            if (bBundledOffering) bundled.addTransition(transition);
            else product.addTransition(transition);
            bTransitions = false;
        }
    }

}
