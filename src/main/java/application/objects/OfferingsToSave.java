package application.objects;

import java.util.Set;

/**
 * Created by tkopec on 2016-09-19.
 */
public class OfferingsToSave {
    private String offerCode;
    private String offerId;
    private Set<OfferingsToSave> productOfferings;

    public String getOfferCode() {
        return offerCode;
    }

    public String getOfferId() {
        return offerId;
    }

    public Set<OfferingsToSave> getProductOfferings() {
        return productOfferings;
    }

    @Override
    public String toString() {
        return "OfferingsToSave{" +
                "offerCode='" + offerCode + '\'' +
                ", offerId='" + offerId + '\'' +
                ", productOfferings=" + productOfferings +
                '}';
    }
}
