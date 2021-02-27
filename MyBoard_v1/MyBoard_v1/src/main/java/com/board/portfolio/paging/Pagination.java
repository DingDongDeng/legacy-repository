package com.board.portfolio.paging;

import java.util.List;

public abstract class Pagination {
    public int pageSize;
    public int rangeSize;

    public Pagination(int pageSize, int rangeSize){
        this.pageSize = pageSize;
        this.rangeSize = rangeSize;
    }

    private PaginationInfo getPaginationInfo(long total, int page){
        return new PaginationInfo(total, page, this.rangeSize, this.pageSize);
    }

    /**
     * getNowPageList()를 통해 현재페이지 목록을 어떻게 구하지는 @Override
     * getTotalCnt()를 통해 전체 개수를 어떻게 구하는지 @Override
     */
    abstract List getNowPageList(int page, PaginationInfo info, int pageSize, int rangeSize, Object object);
    abstract long getTotalCnt(Object object);

    public PagingResult getPagingResult(int page, Object object){
        long total = getTotalCnt(object);
        PaginationInfo info = getPaginationInfo(total, page);
        return new PagingResult(getNowPageList(page, info, this.pageSize, this.rangeSize, object), info);
    }
    public PagingResult getPagingResult(int page){
        return getPagingResult(page,new Object());
    }

}
