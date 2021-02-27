package com.board.portfolio.exception.store;

import com.board.portfolio.exception.custom.CustomRuntimeException;

public class NotFoundStoredEntityException extends CustomRuntimeException {
    public NotFoundStoredEntityException() {
        super("not.found.store.entity");
    }

    public NotFoundStoredEntityException(String msg) {
        super(msg);
    }
}
