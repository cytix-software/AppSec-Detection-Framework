package com.vulnerable;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class VulnerableController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/process")
    public String process(@RequestParam String userInput, Model model) {
        // VULNERABLE: User input passed to JSP without sanitization
        model.addAttribute("userInput", userInput);
        return "result"; // Maps to /WEB-INF/jsp/result.jsp
    }
} 