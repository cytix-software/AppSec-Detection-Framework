package com.vulnerable;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;

import java.io.StringReader;

@Controller
public class VulnerableController {

  @GetMapping("/")
  public String index() {
    return "index";
  }

  @PostMapping(
      value = "/parse-xml",
      consumes = { MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_XML_VALUE },
      produces = MediaType.TEXT_PLAIN_VALUE
  )
  @ResponseBody
  public String parseXml(@RequestBody String xml) {
    try {
      String expandedText = parseXmlUnsafelyAndGetText(xml);
      if (expandedText == null) expandedText = "";

      return expandedText;

    } catch (Exception e) {
      return "ERROR: " + e.getClass().getSimpleName() + ": " + e.getMessage();
    }
  }

  private String parseXmlUnsafelyAndGetText(String xml) throws Exception {
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

    // Intentionally unsafe for test case, allows unrestricted entity expansion and external entity processing
    dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, false);
    dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false);
    dbf.setFeature("http://xml.org/sax/features/external-general-entities", false); //now disallows external general entities to keep test case specific
    dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
    dbf.setExpandEntityReferences(true);
    dbf.setXIncludeAware(false);
    dbf.setNamespaceAware(false);

    DocumentBuilder builder = dbf.newDocumentBuilder();
    Document doc = builder.parse(new InputSource(new StringReader(xml)));

    String text = doc.getDocumentElement().getTextContent();
    return text == null ? "" : text;
  }
}