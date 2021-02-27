package com.board.portfolio.paging;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.repository.BoardDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SearchBoardPagination extends Pagination {

    private final BoardDetailRepository boardDetailRepository;
    @Autowired
    public SearchBoardPagination(@Value("${board.pageSize}") int pageSize,
                                 @Value("${board.rangeSize}") int rangeSize,
                                 BoardDetailRepository boardDetailRepository){
        super(pageSize, rangeSize);
        this.boardDetailRepository = boardDetailRepository;
    }

    @Override
    public List getNowPageList(int page, PaginationInfo info, int pageSize, int rangeSize, Object object) {
        return boardDetailRepository.getSearchBoardList(info.getStartNum(), pageSize, (BoardDTO.Search) object);
    }

    @Override
    public long getTotalCnt(Object object) {
        return boardDetailRepository.searchBoardCnt((BoardDTO.Search) object);
    }
}









