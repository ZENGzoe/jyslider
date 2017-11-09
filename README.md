# 移动端滑动slider

用于移动端的滑动组件。

#### 演示：

![滑动演示](http://img11.360buyimg.com/cms/jfs/t13420/115/126393665/940664/e6215c8d/5a0417f9N5356f519.gif)

#### demo:

```
<script type="text/javascript" src="js/jyswiper.js"></script>
    <script>
        $(".jy_play").jyswiper({
            swiperCt : $(".J_play_ct"),             //滑动主元素
            winType : 0 ,                           //滑动子元素的宽度，0为屏幕宽度，1为子元素的实际宽度
            isNeedPoint : true ,                    //是否需要滑动导航点
            initIdx : 1,                            //初始态
            slideTime : .3,                        //滑动时间,单位是s
        })
    </script>
```