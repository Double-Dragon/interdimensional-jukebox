var Web3 = require("web3");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  return accept(tx, receipt);
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("AUTOIDJB error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("AUTOIDJB error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("AUTOIDJB contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of AUTOIDJB: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to AUTOIDJB.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: AUTOIDJB not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [],
        "name": "getNextSongs",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "lastSongChange",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getQueuedPlaylistLength",
        "outputs": [
          {
            "name": "sIndex",
            "type": "uint256"
          },
          {
            "name": "eIndex",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "playlist",
        "outputs": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "id",
            "type": "string"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "id",
            "type": "string"
          }
        ],
        "name": "addSong",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "currentSongIndex",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "type": "function"
      },
      {
        "inputs": [],
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "title",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id",
            "type": "string"
          }
        ],
        "name": "AddSong",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id1",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id2",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id3",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id4",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id5",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "id6",
            "type": "string"
          }
        ],
        "name": "NextSongs",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "currentIndex",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "currentLength",
            "type": "uint256"
          }
        ],
        "name": "PlaylistInfo",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x60606040526000600155426002556103e86003556014600455610e7a806100266000396000f3606060405236156100565760e060020a60003504630c6fde69811461005857806351db6e15146100df5780635aa07699146100e85780637c8e000e1461012a578063955de0fd1461018c578063a04a236c1461024d575b005b610056604080516020818101835260008083528351808301855281815284518084018652828152855180850187528381528651808601885284815287519586019097529284526001549495919490939042905b60015460005490101561038557600254600454018290101561038557600180546002805460045401905581018155016100ab565b61025660025481565b610268600154600090819042905b600154600054901015610adb576002546004540182901015610adb57600180546002805460045401905581018155016100f6565b610281600435600080548290811015610002575080526002027f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5638101907f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5640182565b6100566004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843750506040805160208835808b0135601f810183900483028401830190945283835297999860449892975091909101945090925082915084018382808284375094965050505050505060015442905b6000546001541015610b01576002546004540182901015610b01576002805460045401905560018054810181550161021a565b61025660015481565b60408051918252519081900360200190f35b6040805192835260208301919091528051918290030190f35b6040805181815283546002600182161561010002600019019091160491810182905290819060208201906060830190869080156102ff5780601f106102d4576101008083540402835291602001916102ff565b820191906000526020600020905b8154815290600101906020018083116102e257829003601f168201915b5050838103825284546002600182161561010002600019019091160480825260209190910190859080156103745780601f1061034957610100808354040283529160200191610374565b820191906000526020600020905b81548152906001019060200180831161035757829003601f168201915b505094505050505060405180910390f35b60018054600054031061045b5760015460008054909190811015610002579080526040805160029283027f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56401805460206001821615610100026000190190911694909404601f810185900485028301850190935282825290929091908301828280156104525780601f1061042757610100808354040283529160200191610452565b820191906000526020600020905b81548152906001019060200180831161043557829003601f168201915b50939b50505050505b60015460005460029190031061051f5760006000506001600050546001018154811015610002576000918252604080516020938490206002938402016001908101805491821615610100026000190190911693909304601f8101859004850282018501909252818152928301828280156105165780601f106104eb57610100808354040283529160200191610516565b820191906000526020600020905b8154815290600101906020018083116104f957829003601f168201915b50939a50505050505b6001546000546003919003106105e05760015460008054909160020190811015610002576000918252604080516020938490206002938402016001908101805491821615610100026000190190911693909304601f8101859004850282018501909252818152928301828280156105d75780601f106105ac576101008083540402835291602001916105d7565b820191906000526020600020905b8154815290600101906020018083116105ba57829003601f168201915b50939950505050505b6001546000546004919003106106a15760015460008054909160030190811015610002576000918252604080516020938490206002938402016001908101805491821615610100026000190190911693909304601f8101859004850282018501909252818152928301828280156106985780601f1061066d57610100808354040283529160200191610698565b820191906000526020600020905b81548152906001019060200180831161067b57829003601f168201915b50939850505050505b6001546000546005919003106107625760015460008054909160040190811015610002576000918252604080516020938490206002938402016001908101805491821615610100026000190190911693909304601f8101859004850282018501909252818152928301828280156107595780601f1061072e57610100808354040283529160200191610759565b820191906000526020600020905b81548152906001019060200180831161073c57829003601f168201915b50939750505050505b6001546000546006919003106108235760015460008054909160050190811015610002576000918252604080516020938490206002938402016001908101805491821615610100026000190190911693909304601f81018590048502820185019092528181529283018282801561081a5780601f106107ef5761010080835404028352916020019161081a565b820191906000526020600020905b8154815290600101906020018083116107fd57829003601f168201915b50939650505050505b7f241e20488cac5ca5025fa6ef3dd692465b3572f32f48c84147e8ebdd09f143588888888888886040518080602001806020018060200180602001806020018060200187810387528d8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156108be5780820380516001836020036101000a031916815260200191505b5087810386528c8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156109175780820380516001836020036101000a031916815260200191505b5087810385528b8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156109705780820380516001836020036101000a031916815260200191505b5087810384528a8181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156109c95780820380516001836020036101000a031916815260200191505b508781038352898181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610a225780820380516001836020036101000a031916815260200191505b508781038252888181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610a7b5780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390a160408051600154600054908252602082015281517fff968efe4a68f83ff64318ca2cb9b2dabac6a0bf71e8313e966dc47f2f3d1731929181900390910190a15050505050505050565b600154600080549190910311610af057610002565b505060015460005490925090509091565b600054600154600354910310610b1657610002565b60008054600181018083558281838015829011610b4c57600202816002028360005260206000209182019101610b4c9190610bd3565b50505091909060005260206000209060020201600050604080518082019091528681526020818101879052875183546000858152839020939493849360026001841615610100026000190190931692909204601f908101839004820193928c0190839010610c8257805160ff19168380011785555b50610cb2929150610c4c565b50506002015b80821115610c6057600060008201600050805460018160011615610100020316600290046000825580601f10610c3257505b5060018201600050805460018160011615610100020316600290046000825580601f10610c645750610bcd565b601f016020900490600052602060002090810190610c0591905b80821115610c605760008155600101610c4c565b5090565b601f016020900490600052602060002090810190610bcd9190610c4c565b82800160010185558215610bc1579182015b82811115610bc1578251826000505591602001919060010190610c94565b50506020820151816001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d1157805160ff19168380011785555b50610d41929150610c4c565b82800160010185558215610d05579182015b82811115610d05578251826000505591602001919060010190610d23565b50505050507f697fd3d1478c96e828061222679c854d72afbe5afa610524815189baf0148cc284846040518080602001806020018381038352858181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610dcd5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610e265780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a160408051600154600054908252602082015281517fff968efe4a68f83ff64318ca2cb9b2dabac6a0bf71e8313e966dc47f2f3d1731929181900390910190a15050505056",
    "updated_at": 1474854557137,
    "links": {},
    "address": "0x4ab84916a2e43c8145ef55264e2e3f1a72a0f934"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "object") {
      Object.keys(name).forEach(function(n) {
        var a = name[n];
        Contract.link(n, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "AUTOIDJB";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.1.2";

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.AUTOIDJB = Contract;
  }
})();
