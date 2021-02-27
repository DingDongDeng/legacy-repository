package com.board.portfolio;

import com.board.portfolio.domain.entity.*;
import com.board.portfolio.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

@SpringBootTest
class DataBaseTests {
    @Value("${spring.datasource.driver-class-name}")
    private String DRIVER;
    @Value("${spring.datasource.url}")
    private String URL;
    @Value("${spring.datasource.username}")
    private String USER;
    @Value("${spring.datasource.password}")
    private String PW;

    @Test
    void dbConnectionTest() throws ClassNotFoundException {
        if(URL!=null){
            System.out.println(USER);
            System.out.println(PW);
            Class.forName(DRIVER);
            try(Connection con = DriverManager.getConnection(URL, USER, PW)) {
                System.out.println(con);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
