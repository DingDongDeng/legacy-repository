package com.board.portfolio.repository;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.domain.entity.BoardDetail;

import java.util.List;

public interface BoardDetailRepositoryCustom {
    List<BoardDetail> getBoardList(int size);
    List<BoardDetail> getSearchBoardList(long startNum, int pageSize, BoardDTO.Search dto);
    long searchBoardCnt(BoardDTO.Search dto);
}
