# PageSwitch
> 全屏滚动轮播插件

## 立即使用

```HTML
<div id="container">
    <div class="sections">
        <div class="section" id="section0">
            <h3>this is first page</h3>
        </div>
        <div class="section" id="section1">
            <h3>this is second page</h3>
        </div>
        <div class="section" id="section2">
            <h3>this is third page</h3>
        </div>
        <div class="section" id="section3">
            <h3>this is fourth page</h3>
        </div>
    </div>
</div>

<script type="text/javascript" src="jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="pageSwitch.js"></script>
<script type="text/javascript">
    $('#container').PageSwitch();
</script>
```

## 调用方法

方法一  传参数对象

```javascript
var options = {}; // Object
$('#container').PageSwitch(options); //容器选择器名字可变
```

方法二  字符串 'init' 初始化

```javascript
$('#container').PageSwitch('init');
```

方法三 自定义属性调用

```html
<div id="container" data-PageSwitch >
  ...
</div>
```

## Options 参数

Example:

```javascript
//  default
var options = {
  selectors:{
      sections:".sections",
      section:".section",
      page:".pages",
      active:".active"
  },
  index:0,
  easing:"ease",
  duration:500,
  loop:false,
  pagination:true,
  keyboard:true,
  direction:"vertical",
  callback:""
}
```

Options List:

- selectors: type:`Object` 选择器
- sections: type:`String` default:`.sections` slide的容器类名  
- section: type:`String` default:`.section` 每个slide  
- page: type:`String` default:`.pages` 分页容器类名  
- active: type:`String` default:`.active` activeClass  
- index: type:`Number` default:`0` initSlides 初始化slide的索引  
- easing: type:`String` default:`ease` 滚动效果的速度曲线  
- duration: type:`Number` default:`500` 过渡时间  
- loop: type:`Boolean` default:`false` 是否循环
- pagination: type:`Boolean` default:`true` 是否要分页
- keyboard: type:`Boolean` default:`true` 是否开启键盘控制
- direction: type:`String` default:`vertical`  可取值：`horizontal` 



## Callback 回调函数
- callback: type:`Function` default:`''` 回调函数 传入当前slide的索引index作为参数



