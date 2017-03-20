package application.handlers;

import application.objects.Offer;
import application.objects.Product;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class TreeHandler extends DefaultHandler {
    private boolean bOfferId = false;
    private boolean bOfferCode = false;
    private boolean bProductOfferingId = false;
    private boolean bProductOfferingCode = false;
    private boolean bBundledOffering = false;
    private boolean isSelectedOffer = false;
    private Product product = null;
    private Offer offer = null;
    private Product bundled = null;
    private String offerId;

    public TreeHandler(String offerId) {
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
            } else {
                product = new Product();
                product.setProductOfferingId(new String(ch, start, length));
            }
            bProductOfferingId = false;
        } else if (bProductOfferingCode) {
            if (bBundledOffering) bundled.setProductOfferingCode(new String(ch, start, length));
            else product.setProductOfferingCode(new String(ch, start, length));
            bProductOfferingCode = false;
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
    }

    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equalsIgnoreCase("offer") && isSelectedOffer)
            isSelectedOffer = false;
        if (qName.equalsIgnoreCase("bundledOfferings") && isSelectedOffer)
            bBundledOffering = false;
        if (qName.equalsIgnoreCase("productOffering") && isSelectedOffer) {
            if (bBundledOffering) product.addProduct(bundled);
            else offer.addProduct(product);
        }
    }

}
