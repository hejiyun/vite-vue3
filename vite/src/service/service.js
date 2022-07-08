// 拦截器

/**
 * axios基础配置方面不多做介绍了, 大同小异, 基本上是根据自己的需求去做一些变化.
 * 
 * 
 *  通过官网提供的 CancelToken.source 工厂方法创建 cancel token 或者 通过传递一个 executor 
 *  函数到 CancelToken 的构造函数来创建 cancel token, 然后我们请求带上这个cancleToken, 
 *  然后在需要取消的请求后面手动调用 cancel方法进行取消,
 * 
 * 
 */
import Vue from 'vue'
import axios from "axios";
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 30000 // request timeout
});

// 基本原理: 类似于数组的去重, 在不断添加的数组数据中,只要出现重复相同的数据, 则中断旧数据的处理并清除出去
// 保留最新数据
// 具体原理:https://axiu.me/coding/axios-use-canceltoken-to-cancel-request/

//声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let rqList = []; 
const CancelToken = axios.CancelToken;
let removeRepeatUrl = ever => {
  for (let rq in rqList) {
    // 判断是否存在重复请求
    if (
      rqList[rq].config &&
      rqList[rq].config.url === ever.url &&
      rqList[rq].config.method === ever.method
    ) {
      if ((isObjectValueEqual(rqList[rq].config), ever))
        //当当前请求在数组中存在时,取消操作,并将其从数组中移除
        rqList[rq].cancle()
        rqList.splice(rq, 1)
    }
  }
};


// request interceptor
service.interceptors.request.use(
    config => {
        console.log("config", config);
        //在一个ajax发送前执行一下取消操作
        removeRepeatUrl({
        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data
        });
        // 创建cancleToken和cancle取消请求方法, 每个请求都唯一
        config.cancelToken = new cancelToken(c => {
            // 自定义唯一标识
            rqList.push({
                config: {
                method: config.method,
                url: config.url,
                params: config.params,
                data: config.data
                },
                cancle: c // 
            });
        });
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// response interceptor
service.interceptors.response.use(
    res => {
        console.log("响应", res);
        removeRepeatUrl({
        method: res.config.method,
        url: res.config.url,
        params: res.config.params,
        data: res.config.data
        }); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从rqList中移除
        const data = res.data;
        return data;
    },
    err => {
        return Promise.reject(err);
    }
);

export const request = config => {
  return axios({
    ...config
  });
};

const isObjectValueEqual = (a, b) => {
  console.log(a, b);
  // 判断两个对象是否指向同一内存，指向同一内存返回true,同时比较null和undefined情况
  if (a == b) return true;
  if (a == null || a == undefined || b == null || b == undefined) {
    return false;
  }
  // 获取两个对象键值数组
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  // 判断两个对象键值数组长度是否一致，不一致返回false
  if (aProps.length !== bProps.length) return false;
  // 遍历对象的键值
  for (let prop in a) {
    // 判断a的键值，在b中是否存在，不存在，返回false
    if (b.hasOwnProperty(prop)) {
      // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
      if (typeof a[prop] === "object") {
        if (!isObjectValueEqual(a[prop], b[prop])) return false;
      } else if (a[prop] !== b[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

