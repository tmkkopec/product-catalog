package application.objects;

public class Price {
    private String priceMode;
    private String priceType;
    private String priceTypeDescription;
    private String priceDescription;
    private String tax;
    private String currency;
    private String amount;

    public String getPriceMode() {
        return priceMode;
    }

    public void setPriceMode(String priceMode) {
        this.priceMode = priceMode;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public String getPriceTypeDescription() {
        return priceTypeDescription;
    }

    public void setPriceTypeDescription(String priceTypeDescription) {
        this.priceTypeDescription = priceTypeDescription;
    }

    public String getPriceDescription() {
        return priceDescription;
    }

    public void setPriceDescription(String priceDescription) {
        this.priceDescription = priceDescription;
    }

    public String getTax() {
        return tax;
    }

    public void setTax(String tax) {
        this.tax = tax;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }
}
