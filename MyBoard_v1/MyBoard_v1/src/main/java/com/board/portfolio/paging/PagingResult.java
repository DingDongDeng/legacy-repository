package com.board.portfolio.paging;

import lombok.Getter;

import java.util.List;

@Getter
public class PagingResult<T> {
    private List<T> list;
    private long page;
    private long startPage;
    private long endPage;
    private long prevPage;
    private long nextPage;


    public PagingResult(List<T> list, PaginationInfo info) {
        this.list = list;
        this.page = info.getPage();
        this.startPage = info.getStartPage();
        this.endPage = info.getEndPage();
        this.prevPage = info.getPrevPage();
        this.nextPage = info.getNextPage();
    }
}
