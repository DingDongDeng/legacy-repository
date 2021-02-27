package com.board.portfolio.security.handler;

import com.board.portfolio.exception.ApiError;
import com.board.portfolio.exception.GlobalErrorContent;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;

import static com.board.portfolio.util.StaticUtils.objectMapper;

@Component
public class ResponseHandler {
    public void response400(HttpServletResponse res, Object object) throws IOException {
        res.setStatus(400);
        res.setCharacterEncoding("UTF-8");
        res.setContentType("application/json; charset=UTF-8");
        String json = objectMapper.writeValueAsString(object);
        PrintWriter out = res.getWriter();
        out.print(json);
    }
    public void signInResponse400(HttpServletResponse res, String message) throws IOException {
        response400(res,new ApiError(HttpStatus.BAD_REQUEST, Arrays.asList(new GlobalErrorContent(message))));
    }
    public void jwtResponse400(HttpServletResponse res, String message) throws IOException {
        response400(res,new ApiError(HttpStatus.BAD_REQUEST, Arrays.asList(new GlobalErrorContent(message))));
    }
    public static Locale getLocale(HttpServletRequest req){
        Optional<String> langOp = Optional.ofNullable(req.getParameter("lang"));
        String lang = langOp.orElse("ko");
        return new Locale(lang);
    }
}
