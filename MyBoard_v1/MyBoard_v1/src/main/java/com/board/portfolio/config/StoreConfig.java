package com.board.portfolio.config;

import com.board.portfolio.domain.entity.BoardDetail;
import com.board.portfolio.repository.BoardDetailRepository;
import com.board.portfolio.store.manager.StoreManager;
import com.board.portfolio.store.store.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class StoreConfig {
    @Autowired
    private BoardDetailRepository boardDetailRepository;

    @Bean
    public StoreManager storeManager(@Value("${board.pageSize}") int pageSize,
                                     @Value("${board.rangeSize}") int rangeSize){
        int MAX_SIZE = pageSize*rangeSize;
        return new StoreManager(new Store<BoardDetail>("board",boardDetailRepository.getBoardList(MAX_SIZE),MAX_SIZE));
    }
}
