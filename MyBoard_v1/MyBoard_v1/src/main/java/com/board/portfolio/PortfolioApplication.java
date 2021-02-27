package com.board.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@PropertySources({
        @PropertySource("classpath:properties/private/database-config.properties"),
        @PropertySource("classpath:properties/private/mail-config.properties"),
        @PropertySource("classpath:properties/private/jwt-config.properties"),
        @PropertySource("classpath:properties/private/oauth-config.properties"),
        @PropertySource("classpath:properties/pagination-config.properties"),
        @PropertySource("classpath:properties/file-config.properties")
})
public class PortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }

}
