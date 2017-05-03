# eleme
## 单一页面的饿了么手机网站
 
### 项目需求分析

     地址搜索页：
          1. 获取饿了么后台数据
          2. 后台数据绑定模板
          3. 发送地址信息
          4. nginx 反向代理
         
     首页：
           1. 按需加载
           2. 获取地址搜索页发送的地址信息
           3. 发送商家信息
               
     购物车：
           1. 购物车，商品页，多个相同商品  数据同步
           2. 点击购物车出现购物车（遮罩层，商品展示）
           3. 数量为零，删除商品dom节点
           4. 购物车清空
           5. 后期维护
           6. 购物车数据缓存   localStorage
      --> 复杂交互，应将 view 和 data 分离 （专注度分离）
               ：采用面向对象，缓存其实例，用方法改变缓存值
            
            
 # 总结
     spa原理
       锚点链接  监听hash值  href=#apple
 
     面向对象 spa
       对象的继承：让对象在赋值时保持独立
       优点：可读性，可维护性，复用，独立性
       
     创建对象几种方式
       工厂模式
       构造函数
       原型继承
       
     购物车逻辑
     
     localStorage的使用
