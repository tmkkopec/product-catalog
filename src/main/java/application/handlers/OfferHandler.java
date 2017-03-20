package application.handlers;

import application.objects.Offer;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.util.HashSet;
import java.util.Set;

public class OfferHandler extends DefaultHandler {
    private boolean bOfferId = false;
    private boolean bOfferCode = false;
    private Offer offer = null;
    private Set<Offer> offers = new HashSet<Offer>();

    public Set<Offer> getSet() {
        return offers;
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (bOfferId) {
            offer = new Offer();
            //System.out.println("OfferID: " + new String(ch, start, length));
            offer.setOfferId(new String(ch, start, length));
            bOfferId = false;
        } else if (bOfferCode) {
            //System.out.println("OfferCode: " + new String(ch, start, length));
            offer.setOfferCode(new String(ch, start, length));
            bOfferCode = false;
        }
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (qName.equalsIgnoreCase("offerId"))
            bOfferId = true;
        if (qName.equalsIgnoreCase("offerCode"))
            bOfferCode = true;
    }

    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equalsIgnoreCase("offer")) {
            offers.add(offer);
            offer = null;
        }
    }

}
