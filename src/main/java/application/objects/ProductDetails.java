package application.objects;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class ProductDetails {
    private Map<String, Object> generals = new HashMap<String, Object>();
    private Set<Parameter> parameters = new HashSet<Parameter>();
    private Set<String> subscribingObjectTypes = new HashSet<String>();
    private Set<String> salesChannels = new HashSet<String>();
    private Set<Transition> transitions = new HashSet<Transition>();
    private Set<Price> prices = new HashSet<Price>();

    public void addGeneral(String key, Object value) {
        generals.put(key, value);
    }

    public void addParameter(Parameter parameter) {
        parameters.add(parameter);
    }

    public void addSubscribingObjectType(String subscribingObjectType) {
        subscribingObjectTypes.add(subscribingObjectType);
    }

    public void addSalesChannel(String salesChannel) {
        salesChannels.add(salesChannel);
    }

    public void addTransition(Transition transition) {
        transitions.add(transition);
    }

    public void addPrice(Price price) {
        prices.add(price);
    }

    public Map<String, Object> getGenerals() {
        return generals;
    }

    public Set<Parameter> getParameters() {
        return parameters;
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
}
