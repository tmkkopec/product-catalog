package application.handlers;

import application.objects.CategoryOrType;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class CategoryAndAssociationHandler extends DefaultHandler {
    private boolean bAssociationType = false;
    private boolean bProductType1Id = false;
    private boolean bProductType2Id = false;
    private boolean bProductCategory1Id = false;
    private boolean bProductCategory2Id = false;

    private boolean bProductCategoryName = false;
    private boolean bProductCategoryId = false;
    private boolean bProductTypeId = false;
    private boolean bProductTypeName = false;
    private boolean bProductTypes = false;
    private boolean bProductCategories = false;
    private boolean bProductCategoryItems = false;
    private Map<String, CategoryOrType> childrenMap = new HashMap<String, CategoryOrType>();
    private Map<String, String[]> parentsMap = new HashMap<String, String[]>();
    private Map<String, String[]> categoryParentsMap = new HashMap<String, String[]>();
    private Set<String> nodesToBeDeletedIdSet = new HashSet<String>();
    private CategoryOrType parent;
    private CategoryOrType child;
    private SetMultimap<String, String> associations = HashMultimap.create();
    private String node1 = null;
    private String node2 = null;

    private String[] insertArray(String[] a, String[] b, int pos) {
        int aLen = a.length;
        int bLen = b.length;

        if (pos > aLen || pos < 0) return null;

        String[] c = (String[]) Array.newInstance(a.getClass().getComponentType(), aLen + bLen);
        System.arraycopy(a, 0, c, 0, pos);
        System.arraycopy(b, 0, c, pos, bLen);
        if (pos < aLen) System.arraycopy(a, pos, c, bLen + pos, aLen - pos);

        return c;
    }

    private String[] concatenate(String[] a, String[] b) {
        return insertArray(a, b, a.length);
    }

    private void organizeParents(CategoryOrType tempParent) {
        if (tempParent.isCategory()) {
            for (CategoryOrType tempChild : tempParent.getChildren()) {
                String[] parents;
                if (tempChild.isCategory()) {
                    if (categoryParentsMap.get(tempParent.getCategoryId()) != null) {
                        parents = categoryParentsMap.get(tempChild.getCategoryId());
                        categoryParentsMap.put(tempChild.getCategoryId(), concatenate(categoryParentsMap.get(tempParent.getCategoryId()), parents));
                    }
                    organizeParents(tempChild);
                } else {
                    if (categoryParentsMap.get(tempParent.getCategoryId()) != null) {
                        parents = parentsMap.get(tempChild.getTypeId());
                        int pos = 0;
                        for (String father : parents) {
                            if (tempParent.getCategoryId().equals(father))
                                pos = java.util.Arrays.asList(parents).indexOf(father);
                        }
                        parentsMap.put(tempChild.getTypeId(), insertArray(parents, categoryParentsMap.get(tempParent.getCategoryId()), pos));
                    }
                }
            }
        }
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (bAssociationType) {
            node2 = new String(ch, start, length);
            bAssociationType = false;
        }
        if (bProductType1Id) {
            if ((new String(ch, start, length)).trim().length() > 0)
                node1 = "t" + (new String(ch, start, length)).trim();
            bProductType1Id = false;
        }
        if (bProductType2Id) {
            if ((new String(ch, start, length)).trim().length() > 0)
                node2 = node2 + "t" + (new String(ch, start, length)).trim();
            bProductType2Id = false;
        }
        if (bProductCategory1Id) {
            if ((new String(ch, start, length)).trim().length() > 0)
                node1 = "c" + (new String(ch, start, length)).trim();
            bProductCategory1Id = false;
        }
        if (bProductCategory2Id) {
            if ((new String(ch, start, length)).trim().length() > 0)
                node2 = node2 + "c" + (new String(ch, start, length)).trim();
            bProductCategory2Id = false;
            associations.put(node1, node2);
        }
        if (bProductCategoryName && bProductCategories) {
            parent = new CategoryOrType(true);
            parent.setName(new String(ch, start, length));
            bProductCategoryName = false;
        }
        if (bProductCategoryId && bProductCategories && !bProductCategoryItems) {
            parent.setCategoryId(new String(ch, start, length));
            if (associations.get("c" + new String(ch, start, length)).size() > 0)
                parent.setAssociations(associations.get("c" + new String(ch, start, length)));
            childrenMap.put("c" + new String(ch, start, length), parent);
            bProductCategoryId = false;
        }
        if (bProductTypeId && bProductCategoryItems) {
            child = new CategoryOrType(false);
            child.setTypeId(new String(ch, start, length));
            parent.addChild(child);
            bProductTypeId = false;
        }
        if (bProductCategoryId && bProductCategoryItems) {
            child = new CategoryOrType(true);
            child.setCategoryId(new String(ch, start, length));
            parent.addChild(child);
            bProductCategoryId = false;
        }
        if (bProductTypeName && bProductTypes) {
            child = new CategoryOrType(false);
            child.setName(new String(ch, start, length));
            bProductTypeName = false;
        }
        if (bProductTypeId && bProductTypes) {
            child.setTypeId(new String(ch, start, length));
            if (associations.get("t" + new String(ch, start, length)).size() > 0) {
                child.setAssociations(associations.get("t" + new String(ch, start, length)));
            }
            childrenMap.put("t" + new String(ch, start, length), child);
            bProductTypeId = false;
        }
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equalsIgnoreCase("productCategories"))
            bProductCategories = false;
        if (qName.equalsIgnoreCase("productCategoryItems"))
            bProductCategoryItems = false;
        if (qName.equalsIgnoreCase("productTypes")) {
            for (CategoryOrType tempParent : childrenMap.values()) {
                if (tempParent.isCategory()) {
                    for (CategoryOrType tempChild : tempParent.getChildren()) {
                        String[] parents = {null};
                        if (tempChild.isCategory()) {
                            CategoryOrType categoryBody = childrenMap.get("c" + tempChild.getCategoryId());
                            if (categoryBody != null) {
                                tempChild.setName(categoryBody.getName());
                                tempChild.setChildren(categoryBody.getChildren());
                                tempChild.setAssociations(categoryBody.getAssociations());
                            }
                            parents[0] = tempParent.getCategoryId();
                            categoryParentsMap.put(tempChild.getCategoryId(), parents);
                            nodesToBeDeletedIdSet.add("c" + tempChild.getCategoryId());
                        } else {
                            CategoryOrType typeBody = childrenMap.get("t" + tempChild.getTypeId());
                            if (typeBody != null) {
                                tempChild.setName(typeBody.getName());
                                tempChild.setAssociations(typeBody.getAssociations());
                            }
                            parents = parentsMap.get(tempChild.getTypeId());
                            if (parents != null) {
                                String[] newCat = {tempParent.getCategoryId()};
                                parents = concatenate(parents, newCat);
                                parentsMap.put(tempChild.getTypeId(), parents);
                            } else {
                                String[] temp = {null};
                                parents = temp;
                                parents[0] = tempParent.getCategoryId();
                                parentsMap.put(tempChild.getTypeId(), parents);
                            }
                            nodesToBeDeletedIdSet.add("t" + tempChild.getTypeId());
                        }
                    }
                }
            }
            for (String tempId : nodesToBeDeletedIdSet) childrenMap.remove(tempId);
            for (CategoryOrType tempParent : childrenMap.values()) {
                organizeParents(tempParent);
            }
            bProductTypes = false;
        }
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (qName.equalsIgnoreCase("associationType"))
            bAssociationType = true;
        if (qName.equalsIgnoreCase("productType1Id"))
            bProductType1Id = true;
        if (qName.equalsIgnoreCase("productType2Id"))
            bProductType2Id = true;
        if (qName.equalsIgnoreCase("productCategory1Id"))
            bProductCategory1Id = true;
        if (qName.equalsIgnoreCase("productCategory2Id"))
            bProductCategory2Id = true;
        if (qName.equalsIgnoreCase("productCategoryName"))
            bProductCategoryName = true;
        if (qName.equalsIgnoreCase("productCategoryId"))
            bProductCategoryId = true;
        if (qName.equalsIgnoreCase("productTypes"))
            bProductTypes = true;
        if (qName.equalsIgnoreCase("productTypeName"))
            bProductTypeName = true;
        if (qName.equalsIgnoreCase("productTypeId"))
            bProductTypeId = true;
        if (qName.equalsIgnoreCase("productCategories"))
            bProductCategories = true;
        if (qName.equalsIgnoreCase("productCategoryItems"))
            bProductCategoryItems = true;
    }

    public Set<CategoryOrType> getSet() {
        return new HashSet<CategoryOrType>(childrenMap.values());
    }

    public Map<String, String[]> getParents() {
        return parentsMap;
    }

}
