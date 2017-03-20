package application.objects;

/**
 * Created by tkopec on 2016-09-26.
 */
public class OfferingsDTO {
    private OfferingsToSave bundles;
    private String document;

    public OfferingsToSave getBundles() {
        return bundles;
    }

    public String getDocument() {
        return document;
    }

    @Override
    public String toString() {
        return "OfferingsDTO{" +
                "bundles=" + bundles +
                ", document='" + document + '\'' +
                '}';
    }
}
