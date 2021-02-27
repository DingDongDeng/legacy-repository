package com.board.portfolio.paging;

import lombok.Getter;

@Getter
public class PaginationInfo {
    /**
     *  startNum은 repository가 몇번째 게시물부터 쿼리하면 되는지를 의미
     *  (id를 의미하는게 아님, 개수를 의미)
     */
    private int page;
    private long startPage;
    private long endPage;
    private long prevPage;
    private long nextPage;
    private long startNum;

    public PaginationInfo(long total, int page, int rangeSize, int pageSize) {
        long startNum = (page-1) * pageSize+1;
        long totalPage = (long) Math.ceil((double)total/(double)pageSize);
        long startPage = ((page-1)/rangeSize)*rangeSize+1;
        long endPage = (startPage+rangeSize-1)>totalPage?totalPage:(startPage+rangeSize-1);
        long prevPage = (page-1)>0?(page-1):-1;
        long nextPage = (page+1)<=totalPage?(page+1):-1;

        this.page = page;
        this.startPage = startPage;
        this.endPage = endPage;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
        this.startNum = startNum;
    }
}
