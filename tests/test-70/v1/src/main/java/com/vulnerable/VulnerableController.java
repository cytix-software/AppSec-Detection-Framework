package com.vulnerable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Controller
public class VulnerableController {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    // CWE-564: SQL Injection: Direct SQL Query
    // VULNERABLE: User input directly in SQL query without sanitization
    @PostMapping("/search")
    public String findUserById(@RequestParam String userId, Model model) {
        try {
            // VULNERABLE: User input concatenated directly into SQL query
            String sql = "SELECT * FROM users WHERE id = " + userId;
            Query query = entityManager.createNativeQuery(sql, User.class);
            List<User> users = query.getResultList();
            
            model.addAttribute("users", users);
            model.addAttribute("searchId", userId);
            
        } catch (Exception e) {
            model.addAttribute("error", "Error: " + e.getMessage());
        }
        
        return "index";
    }
} 