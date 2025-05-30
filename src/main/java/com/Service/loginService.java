package com.Service;

import com.Common.Result;
import org.springframework.stereotype.Service;

@Service
public interface loginService {

    Result login(String username, String password);

    Result register(String username, String password);
}
