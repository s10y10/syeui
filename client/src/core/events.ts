/**
 * Created with JetBrains WebStorm.
 * User: bruce
 * Date: 7/11/13
 * Time: 8:23 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 *
 * @type {number}               过滤器Id总数
 * @private
 */
var __moo_filter_id = 0;
/**
 * 过滤器的全局缓存对象
 * @type {{}}
 * @private
 */
var __moo_filter = {};
/**
 * 动作全局缓存对象
 * @type {{}}
 * @private
 */
var __moo_actions:Array<any> = null;

/**
 * 当前过滤器中的对象
 * @type {Array}
 * @private
 */
var __moo_current_filter = [];

var __event_context = this;

var __functionContextIndex = 1;

var __functionIndex = 1;

var __moo_objects = {};

/**
 * 获取方法的唯一标识串
 * @param tag                   标签
 * @param functionGetId         方法名称
 * @param priority              优先级
 * @returns {*}                 返回唯一标识串
 * @private
 */
function _mooFilterBuildUniqueId(tag, functionGetId, functionContext, priority)
{
    if (!functionContext.__event__id__)
    {
        functionContext.__event__id__ = __functionContextIndex++;
    }

    if (typeof(functionGetId) == "string")
    {
        functionGetId = functionContext[functionGetId];
    }

    if (!functionGetId.__event__id__)
    {
        functionGetId.__event__id__ = __functionIndex++;
    }

    return functionContext.__event__id__ + "_" + tag + "_" + functionGetId.__event__id__;
}

/**
 * 调用过滤器为all的方法
 * @private
 */
function _mooCallAllHook(tag, value)
{
    var args = [];
    if (args.length == 0)
    {
        for (var i = 0; i < arguments.length; i ++)
        {
            args.push(arguments[i]);
        }
    }
    for (var key in __moo_filter["all"])
    {
        var vv = __moo_filter["all"][key];
        for (var key2 in vv)
        {
            var v = vv[key2];

            if (v["function"])
            {
                args[1] = value;
                value = v["function"].apply(v["context"], args);
            }
        }
    }

    return value;
}

/**
 * 添加行为
 * @param tag                   行为标识名称
 * @param functionToAdd         行为回调函数
 * @param priority              行为回调函数调用的优先级(越小越高)
 * @param acceptedArgs          行为回调函数的参数个数
 * @returns {*}                 是否添加成功
 */
function addAction(tag, functionToAdd, functionContext, priority = 100)
{
    return addFilter(tag, functionToAdd, functionContext, priority);
}

/**
 * 添加过滤器
 * @param tag                   过滤器的标识名称
 * @param functionToAdd         过滤器回调函数
 * @param priority              过滤器回调函数调用的优先级(越小越高)
 * @param acceptedArgs          过滤器回调的参数个数
 * @returns {boolean}           是否添加成功
 */
function addFilter(tag, functionToAdd, functionContext, priority = 100)
{
    var idx = _mooFilterBuildUniqueId(tag, functionToAdd, functionContext, priority);
    if (!__moo_filter[tag])
    {
        __moo_filter[tag] = {};
    }
    if (!__moo_filter[tag][priority])
    {
        __moo_filter[tag][priority] = {};
    }
    __moo_filter[tag][priority][idx] = {"function": functionToAdd, "context": functionContext};
    if (!__moo_objects[functionContext.__event__id__]) {
        __moo_objects[functionContext.__event__id__] = [];
    }
    __moo_objects[functionContext.__event__id__].push({"idx": idx, "priority": priority});
    return true;
}

function fvalue(val:any):any {
    return function() {
        return val;
    }
}

/**
 * 执行行为
 * @param tag                   行为标识名称
 * @param arg                   行为回调函数的参数
 */
function doAction(tag, ...args)
{
    if (!__moo_actions)
    {
        __moo_actions = [];
    }

    if (__moo_actions[tag])
    {
        __moo_actions[tag] = 1;
    }
    else
    {
        __moo_actions[tag]++;
    }

    if (__moo_actions["all"])
    {
        __moo_current_filter.push(tag);
        _mooCallAllHook.apply(_mooCallAllHook, args);
    }

    if (!__moo_filter[tag])
    {
        if (__moo_filter["all"])
        {
            __moo_current_filter.pop();
        }
        return;
    }

    //to-do sort

    var filters = __moo_filter[tag];

    for (var key in filters)
    {
        var ret:any = null;
        var vv = __moo_filter[tag][key];
        for (var key2 in vv)
        {
            var v = vv[key2];
            if (v["function"])
            {
                ret = v["function"].apply(v["context"], args);
            }
            if (ret && ret.cancel == true) {
                break;
            }
        }
        if (ret && ret.cancel == true) {
            break;
        }
    }
    __moo_current_filter.pop();
}

/**
 * 是否存在指定标识的行为
 * @param tag                   标识名称
 * @returns {*}
 */
function didAction(tag)
{
    if (!__moo_actions || !__moo_actions[tag])
    {
        return false;
    }
    return __moo_actions[tag];
}

/**
 * 应用过滤器
 * @param tag                  标识名称
 * @param value                过滤器需要过滤的内容
 * @returns {*}
 */
function applyFilters(tag, ...args2)
{
//    cc.log("applyFilter:"+tag);
    var args = [];

    var value = args2[0];

    var ret = value;
    if (__moo_filter["all"])
    {
        args = [tag];
        __moo_current_filter.push(tag);
        for (var i = 0; i < args2.length; i ++)
        {
            args.push(args2[i]);
        }
        ret = _mooCallAllHook.apply(_mooCallAllHook, args);
    }

    if (!__moo_filter[tag])
    {
        if (__moo_filter["all"])
        {
            __moo_current_filter.pop();
        }
        return ret;
    }

    if (!__moo_filter["all"])
    {
        __moo_current_filter.push(tag);
    }

    //to-do sort

    if (args.length == 0)
    {
        args = [tag];
        for (var i = 0; i < args2.length; i ++)
        {
            args.push(args2[i]);
        }
    }

    for (var key in __moo_filter[tag])
    {
        var vv = __moo_filter[tag][key];
        for (var key2 in vv)
        {
            var v = vv[key2];
            if (v["function"])
            {
                args[1] = value;
                var ret = v["function"].apply(v["context"], args.slice(1, args.length));
                if (typeof(ret) != 'undefined') {
                    value = ret;
                }
            }
        }
    }

    __moo_current_filter.pop();
    return value;
}

/**
 * 移除指定过滤器
 * @param tag
 * @param functionToRemove
 * @param priority
 * @returns {*}
 */
function removeFilter(tag, functionToRemove, functionContext = __event_context, priority = 100)
{
    functionToRemove = _mooFilterBuildUniqueId(tag, functionToRemove, functionContext, priority);
    return removeFilterByBase(tag, priority, functionToRemove, functionContext);
}

function removeFilterByBase(tag, priority, idx, functionContext) {
    var result = __moo_filter[tag] &&
        __moo_filter[tag][priority] &&
        __moo_filter[tag][priority][idx];

    if (result)
    {
        delete __moo_filter[tag][priority][idx];

        if (__moo_filter[tag][priority].isEmpty()) {
            delete __moo_filter[tag][priority];
        }
        if (__moo_filter[tag].isEmpty()) {
            delete __moo_filter[tag];
        }

        var obj = __moo_objects[functionContext.__event__id__];
        for (var i = obj.length - 1; i >= 0; i --) {
            var item = obj[i];
            if (item["idx"] == idx && item["priority"] == priority) {
                obj.splice(i, 1);
            }
        }
    }

    return result;
}

/**
 * 移除指定标识的所有过滤器
 * @param tag                   需要被删除的过滤器标识名称
 * @param priority              是否删除指定的优化级的过滤器(默认:false),
 *                              (非false)如果传入一个优化级的值则会删除该优化级里的过滤器，
 *                              (false)否则就删除指定标识名称的所有过滤器
 * @returns {boolean}
 */
function removeAllFilters(tag, priority:any = false)
{
    if (__moo_filter[tag])
    {
        if (false !== priority &&
            __moo_filter[tag][priority])
        {
            delete __moo_filter[tag][priority];
        }
        else
        {
            delete __moo_filter[tag];
        }
    }

    return true;
}

/**
 * 是否存在指定标识的行为
 * @param tag                   标识名称
 * @param functionToCheck       行为回调函数
 * @returns {*}
 */
function hasAction(tag, functionToCheck)
{
    return hasFilter(tag, functionToCheck, null);
}

/**
 * 是否存在指定标识的过滤器
 * @param tag
 * @param functionToCheck
 * @returns {*}
 */
function hasFilter(tag, functionToCheck = false, functionContext = __event_context):any
{
    var has = __moo_filter.hasOwnProperty(tag);
    if (false === functionToCheck || false == has)
    {
        return has;
    }

    var idx = _mooFilterBuildUniqueId(tag, functionToCheck, functionContext, false);
    if (!idx)
    {
        return false;
    }

    var priority:any;
    for (priority in __moo_filter[tag])
    {
        var pri:number = parseInt(priority);
        if (__moo_filter[tag][pri][idx])
        {
            return priority;
        }
    }

    return false;
}

/**
 * 移除指定标识、回调函数及优先级的行为
 * @param tag
 * @param functionToRemove
 * @param priority
 * @returns {*}
 */
function removeAction(tag, functionToRemove, functionContext, priority = 100)
{
    return removeFilter(tag, functionToRemove, functionContext, priority);
}

/**
 *
 * @param tag
 * @param priority
 * @returns {boolean}
 */
function removeAllAction(tag, priority)
{
    return removeAllFilters(tag, priority);
}

function removeEventsByTarget(target:any):void {
    var id = target.__event__id__;
    var obj = __moo_objects[id];
    var r = /^\d+\_(.*?)\_\d+$/gi;
    while(obj && obj.length) {
        r.lastIndex = 0;
        var item = obj[0];
        var arr = r.exec(item["idx"]);
        if (arr) {
            removeFilterByBase(arr[1], item["priority"], item["idx"], target);
        }
    }
    delete __moo_objects[id];
}