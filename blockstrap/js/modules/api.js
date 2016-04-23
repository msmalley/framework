/*
 * 
 *  Blockstrap v0.6.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var api = {};
    var api_timeout = 1800000;
    var active_requests = {};
    var apis = $.fn.blockstrap.settings.apis;
    var blockchains = $.fn.blockstrap.settings.blockchains;
    var api_key = $.fn.blockstrap.core.option('key', false);
    
    api.api_service  = $.fn.blockstrap.core.api();
    
    if($.fn.blockstrap.settings.cache && $.fn.blockstrap.settings.cache.api && $.fn.blockstrap.settings.cache.api.timeout)
    {
        api_timeout = $.fn.blockstrap.settings.cache.api.timeout;
    }
    
    api.address = function(hash, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('address', hash, blockchain, service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_address', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var address = {
                        address: 'N/A',
                        hash: 'N/A',
                        tx_count: 0,
                        blockchain: blockchain,
                        received: 0,
                        balance: 0,
                    }
                    if(results)
                    {
                        address = api.results(address, results, blockchain, 'address', callback, service);               
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_address', function()
                        {
                            callback(address);
                        }, address);
                    }
                    else 
                    {
                        return address;
                    }
                }
            }, 'GET', false, blockchain, 'address', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_address', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.addresses = function(hashes, blockchain, callback, service)
    {
        var hashed_url = '';
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        if($.isArray(hashes))
        {
            var delimiter = '&addresses=';
            var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
            if(map.from.addresses.delimiter) delimiter = map.from.addresses.delimiter;
            
            $.each(hashes, function(k, hash)
            {
                if(k === 0) hashed_url+= hash;
                else hashed_url+= delimiter + hash;
            });

            var api_url = api.url('addresses', hashed_url, blockchain, service);
            if(api_url)
            {
                api.request(api_url, function(results)
                {
                    var addresses = [];
                    if(results)
                    {
                        $.each(results, function(k, v)
                        {
                            var address = {
                                address: 'N/A',
                                hash: 'N/A',
                                tx_count: 0,
                                blockchain: blockchain,
                                received: 0,
                                balance: 0
                            }
                            address = api.results(address, results[k], blockchain, 'addresses', false, service);
                            addresses.push(address);
                        })
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_addresses', function()
                        {
                            callback(addresses);
                        }, addresses);
                    }
                    else 
                    {
                        return addresses;
                    }
                }, 'GET', false, blockchain, 'addresses', false, false, service);
            }
            else if(callback)
            {
                $.fn.blockstrap.core.apply_actions('api_addresses', function()
                {
                    callback(false);
                });
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    
    api.balance = function(hash, blockchain, callback, service)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        api.address(hash, blockchain, function(address)
        {
            if(address && address.balance) 
            {
                $.fn.blockstrap.core.apply_actions('api_balance', function()
                {
                    callback(address.balance);
                }, address.balance);
            }
            else 
            {
                $.fn.blockstrap.core.apply_actions('api_balance', function()
                {
                    callback(0);
                });
            }
        }, service);
    }
    
    api.block = function(height, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('block', height, blockchain, service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_block', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var block = {
                        blockchain: blockchain,
                        height: 'N/A',
                        hash: 'N/A',
                        prev: 'N/A',
                        next: 'N/A',
                        tx_count: 0,
                        time: 0
                    };
                    if(results)
                    {
                        block = api.results(block, results, blockchain, 'block', false, service);
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_block', function()
                        {
                            callback(block);
                        }, block);
                    }
                    else 
                    {
                        return block;
                    }
                }
            }, 'GET', false, blockchain, 'block', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_block', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.dnkey = function(id, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('dnkey', id, blockchain, service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_dnkey', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkeys: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkey', false, service);
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_dnkey', function()
                        {
                            callback(dnkeys);
                        }, dnkeys);
                    }
                    else 
                    {
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkey', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_dnkey', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.dnkeys = function(id, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('dnkeys', id, blockchain, service);
        if(api_url && blockchain == 'multi')
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var dnkeys = {
                        blockchain: blockchain,
                        dnkeys: false
                    };
                    if(results)
                    {
                        dnkeys = api.results(dnkeys, results, blockchain, 'dnkeys', false, service);
                    }
                    $.each(dnkeys.dnkeys, function(chain, obj)
                    {
                        $.each($.fn.blockstrap.settings.blockchains, function(this_chain, values)
                        {
                            if(values.lib == chain)
                            {
                                dnkeys.dnkeys[this_chain] = obj;
                                delete dnkeys.dnkeys[chain];
                            }   
                        });
                    });
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
                        {
                            callback(dnkeys);
                        }, dnkeys);
                    }
                    else 
                    {
                        return dnkeys;
                    }
                }
            }, 'GET', false, blockchain, 'dnkeys', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_dnkeys', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.map = function(blockchain)
    {
        if(!blockchain) blockchain = 'btc';
        if(typeof apis[blockchain] == 'undefined') blockchain = 'defaults';
        if(typeof apis[blockchain][api.api_service] == 'undefined')
        {
            if(typeof apis['defaults'][api.api_service] != 'undefined')
            {
                return apis['defaults'][api.api_service].functions;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return apis[blockchain][api.api_service].functions;
        }
    }
    
    api.market = function(blockchain, stat, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('market', stat, blockchain, $.fn.blockstrap.api.api_service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_market', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var market = {
                        price_usd_now: 0,
                        tx_count_24hr: 0,
                        sent_usd_24hr: 0,
                        sent_coins_24hr: 0,
                        coins_discovered: 0,
                        marketcap: 0
                    };
                    if(results)
                    {
                        market = api.results(market, results, blockchain, 'market', false, service);
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_market', function()
                        {
                            callback(market);
                        }, market);
                    }
                    else 
                    {
                        return market;
                    }
                }
            }, 'GET', false, blockchain, 'market', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_market', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.request = function(url, callback, type, data, blockchain, call, username, password, service)
    {
        if(!type) type = 'GET';
        if(!blockchain) blockchain = 'btc';
        var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
        var headers = false;
        if(
            $.isPlainObject(blockchains[blockchain]) 
            && $.isPlainObject(blockchains[blockchain].auth) 
            && $.isPlainObject(blockchains[blockchain].auth[service])
        ){
            var auth = blockchains[blockchain].auth[service];
            if(
                !username 
                && typeof auth.username != 'undefined'
            ){
                username = auth.username;
            }
            if(
                !password 
                && typeof auth.password != 'undefined'
            ){
                password = auth.password;
            }
            if(username && password)
            {
                headers = {
                    'Authorization': 'Basic ' + btoa(username + ':' + password)
                }
            }
        }
        var api_type = $.fn.blockstrap.core.apis('type', service);
        var data_type = 'json';
        var use_async = true;
        if(api_type == 'rpc')
        {
            use_async = false;
            data_type = 'jsonp';
            type = 'POST';
        }
        $.ajax({
            url: url,
            type: type,
            dataType: data_type,
            data: data,
            async: use_async,
            headers: headers,
            success: function(results)
            {   
                var extra_key = false;
                var key_to_call = false;
                if(
                    typeof map.from[call] != 'undefined'
                    && typeof map.from[call].key != 'undefined'
                ){
                    if(map.from[call].key.indexOf(".") > -1)
                    {
                        var key_array = map.from[call].key.split('.');
                        if(blockstrap_functions.array_length(key_array) == 2)
                        {
                            if(key_array[0] == '')
                            {
                                key_to_call = key_array[1];
                            }
                            else
                            {
                                key_to_call = key_array[0];
                                extra_key = key_array[1];
                                if(extra_key === '0') extra_key = 0;
                            }
                        }
                    }
                    var data = false;
                    if(
                        results 
                        && key_to_call 
                        || 
                        (
                        results
                        && typeof results.data != 'undefined'
                        && typeof map.from[call] != 'undefined'
                        && typeof map.from[call].key != 'undefined'
                        && typeof results.data[map.from[call].key] != 'undefined'
                        )
                    ){
                        if(key_to_call)
                        {
                            if(extra_key || extra_key === 0)
                            {
                                data = results.data[key_to_call][extra_key];
                            }
                            else
                            {
                                data = results.data[key_to_call];
                            }
                        }
                        else
                        {
                            if(call)
                            {
                                data = results.data[map.from[call].key];
                            }
                            else
                            {
                                data = results.data;
                            }
                        }
                    }
                    else if(
                        typeof results.data != 'undefined' 
                        && !map.from[call].key
                    ){
                        data = results.data;
                    }
                    else
                    {
                        data = results;
                    }
                    if(callback) callback(data);
                }
                else
                {
                    if(callback) callback(results);
                }
            },
            error: function()
            {
                if(callback) callback(false)
            },
            timeout: api_timeout // 15 Seconds
        })
    }
    
    api.relay = function(hash, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var request_data = {};
        var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
        request_data[map.to.relay_param] = hash;
        if(typeof map.to.relay_json != 'undefined')
        {
            request_data = JSON.stringify(request_data);
        }
        var api_url = api.url('relay', hash, blockchain, service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_relay', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var data = false;
                    var tx = false;
                    if(results)
                    {
                        if(results.data)
                        {
                            if(
                                map.from.relay.inner
                                && typeof results.data[map.from.relay.inner] != 'undefined'
                                && typeof results.data[map.from.relay.inner][map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.inner][map.from.relay.txid];
                            }
                            else if(
                                map.from.relay.txid
                                && typeof results.data[map.from.relay.txid] != 'undefined'
                            ){
                                data = results.data[map.from.relay.txid];
                            }
                            if(data)
                            {
                                tx = {
                                    blockchain: blockchain,
                                    txid: data
                                }
                            }
                        }
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_relay', function()
                        {
                            callback(tx);
                        }, tx);
                    }
                    else 
                    {
                        return tx;
                    }
                }
            }, 'POST', request_data, blockchain, 'relay', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_relay', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.results = function(defaults, results, blockchain, request, callback, service)
    {
        var clean_results = false;
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
        var bs = $.fn.blockstrap;
        var $bs = blockstrap_functions;
        
        if(!$.isPlainObject(results))
        {
            var original_results = results;
            results = {};
            results[request] = {};
            results[request][blockchain] = original_results;
        }
        
        if(
            defaults && results 
            && blockchain && request 
            && $.isPlainObject(defaults) 
            && $.isPlainObject(results) 
            && typeof map.from != 'undefined' 
            && typeof map.from[request] != 'undefined' 
        ){
            var result_count = 0;
            var number_of_results = $bs.array_length(defaults);
            $.each(defaults, function(field_name, field_value)
            {
                result_count++;
                if(
                    typeof map.from[request][field_name] != 'undefined' 
                ){
                    var this_map = map.from[request][field_name];
                    var result = results[map.from[request][field_name]];
                    var arrayed_result = bs.core.string_to_array(this_map);
                    if(arrayed_result && $bs.array_length(arrayed_result) === 4)
                    {
                        if(
                            (
                                arrayed_result[1] == '+'
                                || arrayed_result[1] == '-'
                                || arrayed_result[1] == '*'
                                || arrayed_result[1] == '/'
                            )
                            &&
                            (
                                arrayed_result[3] == 'int'
                                || arrayed_result[3] == 'float'
                            )
                        ){
                            var parse_type = arrayed_result[3];
                            if(
                                typeof results[arrayed_result[0]] != 'undefined'
                                && typeof results[arrayed_result[2]] != 'undefined'
                            ){
                                var res_01 = results[arrayed_result[0]];
                                var res_02 = results[arrayed_result[2]];
                                if(parse_type == 'float')
                                {
                                    res_01 = parseFloat(results[arrayed_result[0]]);
                                    res_02 = parseFloat(resultsq[arrayed_result[2]]);
                                    res_01 = res_01 * 100000000;
                                    res_02 = res_02 * 100000000;
                                }
                                else if(parse_type == 'int')
                                {
                                    res_01 = parseInt(results[arrayed_result[0]]);
                                    res_02 = parseInt(results[arrayed_result[2]]);
                                }
                                result = res_01 + res_02;
                                if(arrayed_result[1] == '-')
                                {
                                    result = res_01 - res_02;
                                }
                                else if(arrayed_result[1] == '*')
                                {
                                    if(parse_type == 'int')
                                    {
                                        result = parseInt(res_01 * res_02);
                                    }
                                    else
                                    {
                                        result = res_01 * res_02;
                                    }
                                }
                                else if(arrayed_result[1] == '/')
                                {
                                    result = res_01 / res_02;
                                }
                                defaults[field_name] = result;
                            }
                        }
                    }
                    else if(arrayed_result && $bs.array_length(arrayed_result) === 2)
                    {
                        var parse_type = arrayed_result[1];
                        if(
                            arrayed_result[1] == 'int'
                            || arrayed_result[1] == 'float'
                            || arrayed_result[1] == 'hextohash'
                            || arrayed_result[1] == 'utctoepoch'
                            || arrayed_result[1] == 'count'
                            || arrayed_result[1] == 'lowercase'
                        ){
                            if(parse_type == 'float')
                            {
                                res_01 = parseFloat(results[arrayed_result[0]]).toPrecision(8);
                                res_01 = parseInt((res_01 * 100000000));
                            }
                            else if(parse_type == 'int')
                            {
                                res_01 = parseInt(results[arrayed_result[0]]);
                            }
                            else if(parse_type == 'hextohash')
                            {
                                var address = results[arrayed_result[0]];
                                var hash = bitcoin.Address.fromBase58Check(address);
                                res_01 = hash.toString();
                            }
                            else if(parse_type == 'utctoepoch')
                            {
                                var date = new Date(results[arrayed_result[0]]);
                                var epoch = date.getTime() / 1000;
                                res_01 = epoch;
                            }
                            else if(parse_type == 'count')
                            {
                                var obj = results[arrayed_result[0]];
                                var count = $bs.array_length(obj);
                                res_01 = count;
                            }
                            else if(parse_type == 'lowercase')
                            {
                                res_01 = results[arrayed_result[0]].toLowerCase();
                            }
                            else
                            {
                                res_01 = results[arrayed_result[0]];
                            }
                            defaults[field_name] = res_01;
                        }
                    }       
                    else
                    {
                        if(
                            typeof map.from[request][field_name] != 'undefined' 
                            && typeof results[map.from[request][field_name]] != 'undefined' 
                        ){
                            defaults[field_name] = results[map.from[request][field_name]];
                        }
                        else
                        {
                            defaults[request] = results;
                        }
                    }
                }
            });
        }
        return defaults;
    }
    
    api.service = function(service, chain)
    {
        var bs = $.fn.blockstrap;
        if(typeof bs.settings.blockchains[chain].api != 'undefined')
        {
            return bs.settings.blockchains[chain].api;
        }
        else return api.api_service;
    }
    
    api.settings = function(chain, provider, direction, key)
    {
        var result = false;
        var bs = $.fn.blockstrap.settings;
        if(
            typeof chain != 'undefined'
            && typeof provider != 'undefined'
            && typeof direction != 'undefined'
            && typeof key != 'undefined'
        ){
            if(
                typeof bs.apis.defaults[provider] != 'undefined'
                && typeof bs.apis.defaults[provider].functions != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction] != 'undefined'
                && typeof bs.apis.defaults[provider].functions[direction][key] != 'undefined'
            ){
                return bs.apis.defaults[provider].functions[direction][key];
            }
            else
            {
                if(
                    typeof bs.apis[chain] != 'undefined'
                    && typeof bs.apis[chain][provider] != 'undefined'
                    && typeof bs.apis[chain][provider].functions != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction] != 'undefined'
                    && typeof bs.apis[chain][provider].functions[direction][key] != 'undefined'
                ){
                    return bs.apis[chain][provider].functions[direction][key];
                }
                else
                {
                    return result;
                }
            }
        }
        else
        {
            return result;
        }
    }
    
    api.transaction = function(txid, blockchain, callback, service, return_raw)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('transaction', txid, blockchain, service);
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_transaction', function()
                    {
                        callback(results);
                    }, results)
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var now = new Date().getTime();
                    var transaction = {
                        blockchain: blockchain,
                        txid: 'N/A',
                        size: 'N/A',
                        block: 'N/A',
                        time: parseInt(now / 1000),
                        input: 0,
                        output: 0,
                        value: 0,
                        fees: 0
                    }
                    if(results)
                    {
                        transaction = api.results(transaction, results, blockchain, 'transaction', false, service);
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_transaction', function()
                        {
                            callback(transaction);
                        }, transaction);
                    }
                    else 
                    {
                        return transaction;
                    }
                }
            }, 'GET', false, blockchain, 'transaction', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_transaction', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.transactions = function(address, blockchain, callback, service, return_raw, count, skip)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        var api_url = api.url('transactions', address, blockchain, service);
        // Hack for BS API Pagination
        if(typeof count != 'undefined' && parseInt(count) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][api.api_service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[service].functions.to.tx_pagination.split(', ');
                var key = key_array[0];
                api_url+= '&'+key+'='+count;
            }
        }
        if(typeof count != 'undefined' && parseInt(skip) > 0 )
        {
            if(
                typeof $.fn.blockstrap.settings.apis.defaults[service] == 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis[blockchain][service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis[blockchain][service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
            else if(
                typeof $.fn.blockstrap.settings.apis.defaults[service] != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions.to != 'undefined'
                && typeof $.fn.blockstrap.settings.apis.defaults[service].functions.to.tx_pagination != 'undefined'
            ){
                var key_array = $.fn.blockstrap.settings.apis.defaults[service].functions.to.tx_pagination.split(', ');
                var key = key_array[1];
                api_url+= '&'+key+'='+skip;
            }
        }
            
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_transactions', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var these_results = results;
                    var transactions = [];
                    var now = new Date().getTime();
                    var result_key = false;
                    if(typeof map.from.transactions.inner != 'undefined' && map.from.transactions.inner)
                    {
                        result_key = map.from.transactions.inner;
                    }
                    if(result_key && typeof results[result_key] != 'undefined')
                    {
                        these_results = results[result_key];
                    }
                    if(these_results)
                    {
                        $.each(these_results, function(k, v)
                        {
                            var transaction = {
                                blockchain: blockchain,
                                txid: 'N/A',
                                size: 'N/A',
                                block: 'N/A',
                                time: parseInt(now / 1000),
                                input: 0,
                                output: 0,
                                value: 0,
                                fees: 0
                            };
                            transaction = api.results(
                                transaction, 
                                these_results[k], 
                                blockchain, 
                                'transactions',
                                false,
                                service
                            );
                            transactions.push(transaction);
                        });
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_transactions', function()
                        {
                            callback(transactions);
                        }, transactions);
                    }
                    else 
                    {
                        return transactions;
                    }
                }
            }, 'GET', false, blockchain, 'transactions', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_transactions', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.unspents = function(address, blockchain, callback, confirms, service, return_raw, count, skip)
    {
        if(typeof service == 'undefined' || !service) service = $.fn.blockstrap.core.api();
        if(!confirms) confirms = 0;
        
        var api_url = api.url('unspents', address, blockchain, service);
        if(count)
        {
            api_url+= '&count='+count;
        }
        if(skip)
        {
            api_url+= '&skip='+skip;
        }
        if(api_url)
        {
            api.request(api_url, function(results)
            {
                if(return_raw && callback)
                {
                    $.fn.blockstrap.core.apply_actions('api_unspents', function()
                    {
                        callback(results);
                    }, results);
                }
                else
                {
                    var unspents = [];
                    var map = $.fn.blockstrap.settings.apis.defaults[service].functions;
                    var these_results = results;
                    
                    var result_key = false;
                    if(typeof map.from.unspents.inner != 'undefined' && map.from.unspents.inner)
                    {
                        result_key = map.from.unspents.inner;
                    }
                    if(result_key && typeof results[result_key] != 'undefined')
                    {
                        these_results = results[result_key];
                    }
                    if(these_results)
                    {
                        var reverse = false;
                        if(
                            typeof map.from.unspents.reverse_array != 'undefined' 
                            && map.from.unspents.reverse_array === true
                        ){
                            reverse = true;
                        }
                        var unspent_array = these_results;
                        if(!$.isArray(unspent_array))
                        {
                            unspent_array = these_results[map.from.unspents.key];
                        }
                        $.each(unspent_array, function(k, v)
                        {
                            var unspent = {
                                txid: 'N/A',
                                index: 0,
                                value: 0,
                                script: 'N/A',
                                confirmations: 0
                            }
                            unspent = api.results(unspent, unspent_array[k], blockchain, 'unspents', false, service);
                            if(unspent.confirmations >= confirms) unspents.push(unspent);
                        });
                        if(reverse) unspents = unspents.reverse();
                    }
                    if(callback) 
                    {
                        $.fn.blockstrap.core.apply_actions('api_unspents', function()
                        {
                            callback(unspents);
                        }, unspents);
                    }
                    else 
                    {
                        return unspents;
                    }
                }
            }, 'GET', false, blockchain, 'unspents', false, false, service);
        }
        else if(callback)
        {
            $.fn.blockstrap.core.apply_actions('api_unspents', function()
            {
                callback(false);
            });
        }
        else
        {
            return false;
        }
    }
    
    api.url = function(action, key, blockchain, service)
    {
        var url = false;
        if(action == 'relay') key = '';
        var api_key = $.fn.blockstrap.core.apis('key');
        var key_name = $.fn.blockstrap.core.apis('key_name');
        var api_service = api.api_service;
        if(typeof service != 'undefined')
        {
            api_service = service;
        }
        if($.isArray(api_key))
        {
            api_key = api_key[Math.floor(Math.random()*api_key.length)];
        }
        if(!blockchain) blockchain = 'btc';
        if(apis == 'undefined')
        {
            apis = $.fn.blockstrap.settings.apis;
        }
        if(
            blockchain != 'multi'
            &&
            (
            (
            typeof apis[blockchain] == 'undefined' 
            || typeof apis[blockchain][api_service] == 'undefined'
            || typeof apis[blockchain][api_service].functions.to[action] == 'undefined'    
            || apis[blockchain][api_service].functions.to[action] == ""
            )
            &&
            (
            typeof apis['defaults'] == 'undefined' 
            || typeof apis['defaults'][api_service] == 'undefined'
            || typeof apis['defaults'][api_service].functions.to[action] == 'undefined'  
            || apis['defaults'][api_service].functions.to[action] == ""
            || typeof $.fn.blockstrap.settings.blockchains[blockchain] == 'undefined'
            || typeof $.fn.blockstrap.settings.blockchains[blockchain].apis[api_service] == 'undefined'
            )
            )
        ){
            if(action == 'addresses') key = 'multiple-addresses';
            var text = '<p class="'+key+blockchain+action+'">Please note that the selected API "<strong>'+api_service+'</strong>" used for "<strong>'+key+'</strong>" is either not mapped to the "<strong>'+blockchain+'</strong>" blockchain or does not support the required "<strong>'+action+'</strong>" function.</p>';
            if(
                $('#default-modal').find('h4.modal-title').text() != 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                setTimeout(function()
                {
                    $.fn.blockstrap.core.modal('API Warning', text);
                    $('#blockstrap').removeClass('loading');
                }, $.fn.blockstrap.core.timeouts('loader'));
                return false;
            }
            else if(
                $('#default-modal').find('h4.modal-title').text() == 'API Warning'
                && $('#default-modal').find('.modal-body').find('.'+key+blockchain+action).length < 1
            ){
                var current_text = $('#default-modal').find('.modal-body').html();
                setTimeout(function()
                {
                    $.fn.blockstrap.core.modal('API Warning', current_text+text);
                    $('#blockstrap').removeClass('loading');
                }, $.fn.blockstrap.core.timeouts('loader'));
                return false;
            }
            else
            {
                return false;
            }
        }
        else if(
            blockchain != 'multi'
            &&
            (
            typeof apis[blockchain] != 'undefined' 
            && typeof apis[blockchain][api_service] != 'undefined'
            && typeof apis[blockchain][api_service].functions.to[action] != 'undefined'
            )
        ){
            url = blockchains[blockchain].apis[api_service] + apis[blockchain][api_service].functions.to[action] + key;
            if(apis[blockchain][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis[blockchain][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else if( blockchain != 'multi')
        {
            url = blockchains[blockchain].apis[api_service] + apis['defaults'][api_service].functions.to[action] + key;
            if(apis['defaults'][api_service].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults'][api_service].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis[api_service] + call;
            }
        }
        else
        {
            blockchains = $.fn.blockstrap.settings.blockchains;
            apis = $.fn.blockstrap.settings.apis;
            if(blockchain == 'multi') 
            {
                key_name = $.fn.blockstrap.core.apis('key_name', 'blockstrap');
                api_key = $.fn.blockstrap.core.apis('key', 'blockstrap');
            }
            url = blockchains[blockchain].apis['blockstrap'] + apis['defaults']['blockstrap'].functions.to[action] + key;
            if(apis['defaults']['blockstrap'].functions.to[action].indexOf("$call") > -1)
            {
                var call = apis['defaults']['blockstrap'].functions.to[action].replace("$call", key);
                url = blockchains[blockchain].apis['blockstrap'] + call;
            }
        }
        if(action == 'relay')
        {
            if(url.substr(-1) === '/') 
            {
                url = url.substr(0, url.length - 1);
            }
        }
        if(api_key)
        {
            if(url.indexOf("?") > -1)
            {
                url+='&'+key_name+'='+api_key;
            }
            else
            {
                url+='?'+key_name+'='+api_key;
            }
        }
        var app_id = 'framework';
        if(typeof $.fn.blockstrap.settings.app_id != 'undefined')
        {
            app_id = $.fn.blockstrap.settings.app_id;
        }
        else
        {
            app_id = $.fn.blockstrap.settings.id;
        }
        if(api_service == 'blockstrap')
        {
            app_id+= '_v'+blockstrap_functions.slug($.fn.blockstrap.settings.v);
            if(action == 'stats' || action == 'addresses')
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
            else
            {
                if(url.indexOf("?") > -1)
                {
                    url+= '&app_id='+app_id;
                }
                else
                {
                    url+= '?app_id='+app_id;
                }
            }
        }
        return url;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {api:api});
})
(jQuery);