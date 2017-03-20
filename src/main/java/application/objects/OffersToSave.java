package application.objects;

import java.util.Set;

/**
 * Created by tkopec on 2016-08-17.
 */
public class OffersToSave {
    private String offerId;
    private String productId;
    private String productOfferingCode;
    private String productType;
    private Set<String> productCategory;
    private String productMultiplicity;
    private String productOfferingVariant;
    private String productOfferingVersion;
    private String validFrom;
    private String isRequired;
    private String isProductDiscount;
    private Set<Parameter> parametersSet;
    private Set<String> subscribingObjectTypes;
    private Set<String> salesChannels;
    private Set<Transition> transitions;
    private Set<Price> prices;
    private String document;

    public String getOfferId() {
        return offerId;
    }

    public String getProductId() {
        return productId;
    }

    public String getProductOfferingCode() {
        return productOfferingCode;
    }

    public String getProductType() {
        return productType;
    }

    public Set<String> getProductCategory() {
        return productCategory;
    }

    public String getProductMultiplicity() {
        return productMultiplicity;
    }

    public String getProductOfferingVariant() {
        return productOfferingVariant;
    }

    public String getProductOfferingVersion() {
        return productOfferingVersion;
    }

    public String getValidFrom() {
        return validFrom;
    }

    public String getIsRequired() {
        return isRequired;
    }

    public String getIsProductDiscount() {
        return isProductDiscount;
    }

    public Set<Parameter> getParametersSet() {
        return parametersSet;
    }

    public Set<String> getSubscribingObjectTypes() {
        return subscribingObjectTypes;
    }

    public Set<String> getSalesChannels() {
        return salesChannels;
    }

    public Set<Transition> getTransitions() {
        return transitions;
    }

    public Set<Price> getPrices() {
        return prices;
    }

    public String getDocument() {
        return document;
    }

    @Override
    public String toString() {
        return "DataToSave{" +
                "offerId='" + offerId + '\'' +
                ", productId='" + productId + '\'' +
                ", productOfferingCode='" + productOfferingCode + '\'' +
                ", productType='" + productType + '\'' +
                ", productCategory=" + productCategory +
                ", productMultiplicity='" + productMultiplicity + '\'' +
                ", productOfferingVariant='" + productOfferingVariant + '\'' +
                ", productOfferingVersion='" + productOfferingVersion + '\'' +
                ", validFrom='" + validFrom + '\'' +
                ", isRequired='" + isRequired + '\'' +
                ", isProductDiscount='" + isProductDiscount + '\'' +
                ", parametersSet=" + parametersSet +
                ", subscribingObjectTypes=" + subscribingObjectTypes +
                ", salesChannels=" + salesChannels +
                ", transitions=" + transitions +
                ", prices=" + prices +
                '}';
    }
}
