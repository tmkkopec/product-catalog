package application.objects;

import java.util.Set;

/**
 * Created by tkopec on 2016-09-26.
 */
public class CategoriesDTO {
    private Set<CategoriesToSave> data;
    private String document;

    public Set<CategoriesToSave> getData() {
        return data;
    }

    public String getDocument() {
        return document;
    }
}
