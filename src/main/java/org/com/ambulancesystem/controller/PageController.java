package org.com.ambulancesystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    
    /**
     * 首页路由
     * @return 返回home页面
     */
    @GetMapping("/")
    public String home() {
        return "home";
    }
    
    /**
     * 明确访问/home时的路由
     * @return 返回home页面
     */
    @GetMapping("/home")
    public String homePage() {
        return "home";
    }

    @GetMapping("/traffic")
    public String traffic() {
        return "traffic";
    }
} 