package application.main;

import application.objects.*;
import application.utils.DomParser;
import application.utils.PersistenceManager;
import application.utils.UpdateManager;
import application.utils.XmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by tkopec on 20.03.17.
 */
@RestController
public class SimpleController {
    private byte[] content;
    private DomParser parser = new DomParser();
    @Autowired
    private XmlParser xmlParser;

    @RequestMapping("/resource")
    public Map<String, Object> home() {
        Map<String, Object> model = new HashMap<>();
        Set<Offer> offerSet = xmlParser.parseOffers(new ByteArrayInputStream(content));
        for (Offer off : offerSet)
            model.put(off.getOfferCode(), off);

        return model;
    }

    @RequestMapping("/offer")
    public Map<String, Object> offById(@RequestParam("offerId") String offerId) {
        Map<String, Object> model = new HashMap<>();
        Offer offer = xmlParser.parseOfferForScroll(new ByteArrayInputStream(content), offerId);
        model.put("offer", offer);
        return model;
    }

    @RequestMapping("/product")
    public Map<String, Object> productDet(@RequestParam("offerId") String offerId,
                                          @RequestParam("productId") String productId) {
        Map<String, Object> model = new HashMap<>();
        ProductDetails product = xmlParser.parseProductDetails(new ByteArrayInputStream(content), offerId, productId);
        model.put("product", product);
        return model;
    }

    @RequestMapping("/categoriesandassociations/{parentsOrChildren}")
    public Map<String, Object> categoriesAndAssociations(@PathVariable("parentsOrChildren") String parentsOrChildren) {
        return xmlParser.parseProductCategoriesAndAssociations(new ByteArrayInputStream(content), parentsOrChildren);
    }

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public Document importFile(@RequestParam("file") MultipartFile file) throws IOException {
        this.content = cloneStream(file.getInputStream());
        return new DomParser().parseFile(new ByteArrayInputStream(content));
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public Document saveChanges(@RequestBody OffersToSave data) {
        UpdateManager updateManager = new UpdateManager(parser.stringToDocument(data.getDocument()));
        return updateManager.getDocument();
    }

    @RequestMapping(value = "/export", method = RequestMethod.POST)
    public void exportFile(@RequestBody ExportDTO exportData) {
        new PersistenceManager().exportToFile(parser.stringToDocument(exportData.getDocument()),
                exportData.getFileName());
    }

    @RequestMapping(value = "/saveCategories", method = RequestMethod.POST)
    public Document saveCategories(@RequestBody CategoriesDTO data) {
        UpdateManager updateManager = new UpdateManager(parser.stringToDocument(data.getDocument()));
        updateManager.updateCategories(data.getData());
        updateManager.updateAssociations(data.getData());
        return updateManager.getDocument();
    }

    @RequestMapping(value = "/saveOfferings", method = RequestMethod.POST)
    public Document saveOfferings(@RequestBody OfferingsDTO offerings) {
        UpdateManager updateManager = new UpdateManager(parser.stringToDocument(offerings.getDocument()));
        updateManager.updateOfferings(offerings.getBundles());
        return updateManager.getDocument();
    }

    private byte[] cloneStream(InputStream stream) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[1024];
        int n;
        try {
            while ((n = stream.read(buf)) >= 0)
                baos.write(buf, 0, n);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return baos.toByteArray();
    }
}
