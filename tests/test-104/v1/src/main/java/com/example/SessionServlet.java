
package com.example;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

class MySessionData {
    public String value = "default";
}

public class SessionServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        response.getWriter().println("<h2>Session Demo</h2>");
        response.getWriter().println("<form method='post'><input name='value' placeholder='Enter value'><button type='submit'>Store in Session</button></form>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        String value = request.getParameter("value");
        MySessionData obj = new MySessionData();
        obj.value = value;
        session.setAttribute("sessionData", obj);
        response.setContentType("text/html");
        response.getWriter().println("<h2>Stored object in session.</h2>");
        response.getWriter().println("<a href='/demo'>Back</a>");
    }
}
