package com.vulnerable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class Test75WebApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(Test75WebApplication.class, args);
    }
} 