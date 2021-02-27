package com.board.portfolio.paging;

import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.store.repository.StoredBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BoardPagination extends Pagination {

    private final StoredBoardRepository storedBoardRepository;
    private final BoardRepository boardRepository;
    @Autowired
    public BoardPagination(@Value("${board.pageSize}") int pageSize,
                           @Value("${board.rangeSize}") int rangeSize,
                           BoardRepository boardRepository,
                           StoredBoardRepository storedBoardRepository){
        super(pageSize, rangeSize);
        this.boardRepository = boardRepository;
        this.storedBoardRepository = storedBoardRepository;
    }

    @Override
    public List getNowPageList(int page, PaginationInfo info, int pageSize, int rangeSize, Object object) {
        return storedBoardRepository.getBoardList(page, info.getStartNum(), pageSize);
    }

    @Override
    public long getTotalCnt(Object object) {
        return boardRepository.count();
    }
}









