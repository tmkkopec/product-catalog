package application.objects;

import java.util.HashSet;
import java.util.Set;

public class Offer {
    private String offerId;
    private String offerCode;
    private Set<Product> products;

    public Offer() {
        products = new HashSet<Product>();
    }

    public void addProduct(Product product) {
        products.add(product);
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public String getOfferId() {
        return this.offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public String getOfferCode() {
        return this.offerCode;
    }

    public void setOfferCode(String offerCode) {
        this.offerCode = offerCode;
    }
}