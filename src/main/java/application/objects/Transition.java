package application.objects;

import java.util.HashSet;
import java.util.Set;

public class Transition {
    private String transitionType;
    private Set<Price> prices = new HashSet<Price>();

    public void addPrice(Price price) {
        prices.add(price);
    }

    public String getTransitionType() {
        return transitionType;
    }

    public void setTransitionType(String transitionType) {
        this.transitionType = transitionType;
    }

    public Set<Price> getPrices() {
        return prices;
    }
}
