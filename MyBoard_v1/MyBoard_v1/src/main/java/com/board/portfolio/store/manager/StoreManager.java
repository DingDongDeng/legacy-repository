package com.board.portfolio.store.manager;

import com.board.portfolio.store.store.Store;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class StoreManager {
    private Map storeMap;
    public StoreManager(Store...stores){
        storeMap = new HashMap();
        for(Store store : stores){
            storeMap.put(store.getName(), store);
        }
    }

}
