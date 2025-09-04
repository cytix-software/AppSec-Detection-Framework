package com.demo;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;


@MultipartConfig
public class FileUploadServlet extends HttpServlet {
    private final String UPLOAD_DIR = "/tmp/uploads/";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        response.getWriter().println("<form method='post' enctype='multipart/form-data'>"
            + "<input type='file' name='file'/><button type='submit'>Upload</button></form>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Part filePart = request.getPart("file");
            if (filePart == null || filePart.getSize() == 0) {
                throw new RuntimeException("No file uploaded");
            }
            String fileName = filePart.getSubmittedFileName();
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            File file = new File(UPLOAD_DIR + fileName);
            try (InputStream input = filePart.getInputStream();
                 FileOutputStream output = new FileOutputStream(file)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
            }
            response.setContentType("text/html");
            response.getWriter().println("File uploaded successfully.");
        } catch (Exception ex) {
            // Error message
            response.setContentType("text/html");
            response.getWriter().println("Error: Could not upload file to directory " + UPLOAD_DIR);
            response.getWriter().println("Details: " + ex.getMessage());
        }
    }
}
