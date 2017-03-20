package application.utils;

import application.handlers.CategoryAndAssociationHandler;
import application.handlers.OfferHandler;
import application.handlers.ProductHandler;
import application.handlers.ScrollHandler;
import application.objects.Offer;
import application.objects.ProductDetails;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class XmlParser {
    public Set<Offer> parseOffers(InputStream fileInputStream) {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser parser = factory.newSAXParser();
            OfferHandler handler = new OfferHandler();
            parser.parse(fileInputStream, handler);
            return handler.getSet();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Offer parseOfferForScroll(InputStream fileInputStream, String offerId) {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser parser = factory.newSAXParser();
            ScrollHandler handler = new ScrollHandler(offerId);
            parser.parse(fileInputStream, handler);
            return handler.getOffer();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public ProductDetails parseProductDetails(InputStream fileInputStream, String offerId, String productId) {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser parser = factory.newSAXParser();
            ProductHandler handler = new ProductHandler(offerId, productId);
            parser.parse(fileInputStream, handler);
            return handler.getProduct();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<String, Object> parseProductCategoriesAndAssociations(InputStream fileInputStream, String parentsOrChildren) {
        SAXParserFactory factory = SAXParserFactory.newInstance();

        try {
            SAXParser parser = factory.newSAXParser();
            CategoryAndAssociationHandler handler = new CategoryAndAssociationHandler();
            parser.parse(fileInputStream, handler);
            if ("parents".equals(parentsOrChildren)) return new HashMap<String, Object>(handler.getParents());
            if ("children".equals(parentsOrChildren)) {
                Map<String, Object> childrenMap = new HashMap<String, Object>();
                childrenMap.put("children", handler.getSet());
                return childrenMap;
            }
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}

