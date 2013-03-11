﻿/**
 * psd2html.js - v@1.1.0 r97
 * update: 2013-03-11
 * Author: Yusuke Hirao [http://www.yusukehirao.com]
 * Github: https://github.com/YusukeHirao/psd2html
 * License: Licensed under the MIT License
 */

// Generated by CoffeeScript 1.6.1
'use strict';
var ControlUI, DialogUI, Math, NAMESPACE, VERSION, WindowUI, boundsOffsetX, boundsOffsetY, clearInterval, clearTimeout, close, copy, createDocument, currentHeight, currentWidth, enlargeForSelect, exec, extract, fileNameCounter, fileNames, getBounds, getLayerPath, getMetrics, global, hideLayerWithoutSelf, input, isNaN, isSelect, nameCounter, offsetX, offsetY, originalHeight, originalWidth, output, outputCSS, outputJQUERY, outputJSON, outputLESS, paste, restoreDimension, savable, saveFolder, saveGIF, saveJPEG, savePNG, selectAllLayers, setInterval, setTimeout, showLayer, structures, toSmartObject, varDump, _level,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NAMESPACE = 'psd2html';

VERSION = '1.1.0';

global = this;

Math = global.Math;

setTimeout = global.setTimeout;

clearTimeout = global.clearTimeout;

setInterval = global.setInterval;

clearInterval = global.clearInterval;

isNaN = global.isNaN;

varDump = function(obj) {
  var _key, _rlt, _val;
  _rlt = [];
  for (_key in obj) {
    if (!__hasProp.call(obj, _key)) continue;
    try {
      _val = obj[_key];
      if (!(_val instanceof Function)) {
        _rlt.push(_key + ': ' + _val);
      }
    } catch (error) {

    }
  }
  return alert(_rlt.join('\n'));
};

Number.prototype.fillZero = function(n) {
  var zeros;
  zeros = new Array(n + 1 - this.toString(10).length);
  return zeros.join('0') + this;
};

selectAllLayers = function() {
  var desc, ref;
  ref = new ActionReference();
  ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
  desc = new ActionDescriptor();
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(stringIDToTypeID('selectAllLayers'), desc, DialogModes.NO);
};

toSmartObject = function(layer) {
  if (layer != null) {
    activeDocument.activeLayer = layer;
  }
  executeAction(stringIDToTypeID('newPlacedLayer'), void 0, DialogModes.NO);
  return layer;
};

saveJPEG = function(fileName, dir, quality) {
  var file, filePath, folder, jpegOpt;
  if (dir == null) {
    dir = '';
  }
  if (quality == null) {
    quality = 80;
  }
  folder = new Folder(saveFolder + dir + '/');
  if (!folder.exists) {
    folder.create();
  }
  filePath = folder + '/' + fileName + '.jpg';
  file = new File(filePath);
  jpegOpt = new JPEGSaveOptions();
  jpegOpt.embedColorProfile = false;
  jpegOpt.quality = parseInt(12 * (quality / 100), 10);
  jpegOpt.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
  jpegOpt.scans = 3;
  jpegOpt.matte = MatteType.NONE;
  activeDocument.saveAs(file, jpegOpt, true, Extension.LOWERCASE);
  return file.getRelativeURI(saveFolder);
};

saveGIF = function(fileName, dir) {
  var file, filePath, folder, gifOpt;
  if (dir == null) {
    dir = '';
  }
  folder = new Folder(saveFolder + dir + '/');
  if (!folder.exists) {
    folder.create();
  }
  filePath = folder + '/' + fileName + '.gif';
  file = new File(filePath);
  gifOpt = new GIFSaveOptions();
  gifOpt.colors = 32;
  gifOpt.dither = Dither.NONE;
  gifOpt.interlacted = true;
  gifOpt.matte = MatteType.WHITE;
  gifOpt.palette = Palette.EXACT;
  gifOpt.preserveExactColors = false;
  gifOpt.transparency = true;
  activeDocument.saveAs(file, gifOpt, true, Extension.LOWERCASE);
  return file.getRelativeURI(saveFolder);
};

savePNG = function(fileName, dir) {
  var file, filePath, folder, pngOpt;
  if (dir == null) {
    dir = '';
  }
  folder = new Folder(saveFolder + dir + '/');
  if (!folder.exists) {
    folder.create();
  }
  filePath = folder + '/' + fileName + '.png';
  file = new File(filePath);
  pngOpt = new PNGSaveOptions;
  pngOpt.interlaced = false;
  activeDocument.saveAs(file, pngOpt, true, Extension.LOWERCASE);
  return file.getRelativeURI(saveFolder);
};

outputCSS = function(structures) {
  var className, cssFile, cssText, html, htmlFile, htmlTags, i, layer, text, z, _i, _j, _len, _len1;
  cssText = [];
  for (i = _i = 0, _len = structures.length; _i < _len; i = ++_i) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    text = "." + className + " \{\n	overflow: hidden;\n	position: absolute;\n	top: " + layer.y + "px;\n	left: " + layer.x + "px;\n	z-index: " + z + ";\n	width: " + layer.width + "px;\n	height: " + layer.height + "px;\n	background: url(" + layer.url + ") no-repeat scroll 0 0;\n\}";
    cssText.push(text);
  }
  cssFile = new File(saveFolder + '/' + 'style.css');
  cssFile.open('w');
  cssFile.encoding = 'utf-8';
  cssFile.write(cssText.join('\n'));
  cssFile.close();
  htmlTags = [];
  for (i = _j = 0, _len1 = structures.length; _j < _len1; i = ++_j) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    text = "<div class=\"" + className + "\">\n	<!-- <img class=\"" + className + "\" src=\"" + layer.url + "\" alt=\"" + layer.name + "\" width=\"" + layer.width + "\" height=\"" + layer.height + "\"> -->\n	<!-- <div class=\"" + className + "\" data-src=\"" + layer.url + "\" data-width=\"" + layer.width + "\" data-height=\"" + layer.height + "\" data-x=\"" + layer.x + "\" data-y=\"" + layer.y + "\" data-z=\"" + z + "\">" + layer.name + "</div> -->\n</div>";
    htmlTags.push(text);
  }
  html = "<!doctype html>\n<html>\n<head>\n	<meta charset=\"utf-8\">\n	<link rel=\"stylesheet\" href=\"style.css\">\n</haed>\n<body>\n\n$\n\n</body>\n</html>";
  htmlFile = new File(saveFolder + '/' + 'index.html');
  htmlFile.open('w');
  htmlFile.encoding = 'utf-8';
  htmlFile.write(html.replace('$', htmlTags.join('\n')));
  htmlFile.close();
};

outputJSON = function(structures) {
  var className, i, layer, outputFile, outputText, text, z, _i, _len;
  outputText = [];
  for (i = _i = 0, _len = structures.length; _i < _len; i = ++_i) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    text = "\{\n	\"name\": \"" + layer.name + "\",\n	\"className\": \"" + className + "\",\n	\"x\": " + layer.x + ",\n	\"y\": " + layer.y + ",\n	\"z\": " + z + ",\n	\"width\": " + layer.width + ",\n	\"height\": " + layer.height + ",\n	\"url\": \"" + layer.url + "\"\n\}";
    outputText.push(text);
  }
  outputFile = new File(saveFolder + '/' + 'structures.json');
  outputFile.open('w');
  outputFile.encoding = 'utf-8';
  outputFile.write('[' + outputText.join(',\n') + ']');
  outputFile.close();
};

outputLESS = function(structures) {
  var className, cssText, i, layer, lessFile, sassFile, scssFile, text, z, _i, _j, _len, _len1;
  cssText = [];
  for (i = _i = 0, _len = structures.length; _i < _len; i = ++_i) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    text = "." + className + " \{\n	overflow: hidden;\n	position: absolute;\n	top: " + layer.y + "px;\n	left: " + layer.x + "px;\n	z-index: " + z + ";\n	width: " + layer.width + "px;\n	height: " + layer.height + "px;\n	background: url(" + layer.url + ") no-repeat scroll 0 0;\n\}";
    cssText.push(text);
  }
  lessFile = new File(saveFolder + '/' + 'position.less');
  lessFile.open('w');
  lessFile.encoding = 'utf-8';
  lessFile.write(cssText.join('\n'));
  lessFile.close();
  scssFile = new File(saveFolder + '/' + '_position.scss');
  lessFile.copy(scssFile);
  cssText = [];
  for (i = _j = 0, _len1 = structures.length; _j < _len1; i = ++_j) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    text = "." + className + "\n	overflow: hidden\n	position: absolute\n	top: " + layer.y + "px\n	left: " + layer.x + "px\n	z-index: " + z + "\n	width: " + layer.width + "px\n	height: " + layer.height + "px\n	background: url(" + layer.url + ") no-repeat scroll 0 0";
    cssText.push(text);
  }
  sassFile = new File(saveFolder + '/' + '_position.sass');
  sassFile.open('w');
  sassFile.encoding = 'utf-8';
  sassFile.write(cssText.join('\n'));
  sassFile.close();
};

outputJQUERY = function(structures) {
  var cfFile, cfjText, cfvText, className, i, jsFile, jsjText, jsvText, jtext, layer, variableName, vtext, z, _i, _j, _len, _len1;
  jsvText = [];
  jsjText = [];
  for (i = _i = 0, _len = structures.length; _i < _len; i = ++_i) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    variableName = className.replace(/_([a-z])/g, function($0, $1) {
      return $1.toUpperCase();
    });
    vtext = "$" + variableName;
    jsvText.push(vtext);
    jtext = "$" + variableName + " = $('." + className + "')";
    jsjText.push(jtext);
  }
  jsFile = new File(saveFolder + '/' + 'position.js');
  jsFile.open('w');
  jsFile.encoding = 'utf-8';
  jsFile.writeln('var\n\t' + jsvText.join(',\n\t') + ';\n\n');
  jsFile.write(jsjText.join(';\n') + ';');
  jsFile.close();
  cfvText = [];
  cfjText = [];
  for (i = _j = 0, _len1 = structures.length; _j < _len1; i = ++_j) {
    layer = structures[i];
    z = i * 10;
    className = layer.url.replace(/\//g, '_').replace(/\.[a-z]+$/i, '');
    variableName = className.replace(/_([a-z])/g, function($0, $1) {
      return $1.toUpperCase();
    });
    vtext = "$" + variableName;
    cfvText.push(vtext);
    jtext = "$" + variableName + " = $ '." + className + "'";
    cfjText.push(jtext);
  }
  cfFile = new File(saveFolder + '/' + 'position.coffee');
  cfFile.open('w');
  cfFile.encoding = 'utf-8';
  cfFile.writeln(cfvText.join(' =\n') + ' = undefined\n\n');
  cfFile.write(cfjText.join('\n'));
  cfFile.close();
};

ControlUI = (function() {

  function ControlUI($window, type, width, height, left, top, options) {
    this.$window = $window;
    this.type = type;
    this.width = width != null ? width : 100;
    this.height = height != null ? height : 20;
    this.left = left != null ? left : 0;
    this.top = top != null ? top : 0;
    if (options == null) {
      options = [];
    }
    this.window = this.$window.window;
    this.context = this.window.add.apply(this.window, [this.type, [this.left, this.top, this.width + this.left, this.height + this.top]].concat(options));
  }

  ControlUI.prototype.close = function(value) {
    return this.window.close(value);
  };

  ControlUI.prototype.val = function(getValue) {
    var type, value;
    switch (this.type) {
      case 'edittext':
      case 'statictext':
        type = 'text';
        break;
      default:
        type = 'value';
    }
    if (getValue != null) {
      this.context[type] = value = getValue.toString();
    } else {
      value = this.context[type];
    }
    return value;
  };

  ControlUI.prototype.on = function(event, callback) {
    var self,
      _this = this;
    event = event.toLowerCase().replace(/^on/i, '').replace(/^./, function(character) {
      return character.toUpperCase();
    });
    self = this;
    this.context['on' + event] = function() {
      return callback.apply(self, arguments);
    };
    return this;
  };

  return ControlUI;

})();

WindowUI = (function() {

  function WindowUI(type, name, width, height, options, callback) {
    var BUTTON_HEIGHT, BUTTON_MARGIN, BUTTON_WIDTH, stop;
    this.type = type;
    this.name = name != null ? name : 'ダイアログボックス';
    this.width = width != null ? width : 100;
    this.height = height != null ? height : 100;
    this.window = new Window(this.type, this.name, [0, 0, this.width, this.height], options);
    this.window.center();
    this.controls = [];
    this.onOK = function() {};
    this.onCancel = function() {};
    BUTTON_WIDTH = 100;
    BUTTON_HEIGHT = 20;
    BUTTON_MARGIN = 10;
    this.addButton('OK', BUTTON_WIDTH, BUTTON_HEIGHT, this.width - BUTTON_WIDTH - BUTTON_MARGIN, this.height - BUTTON_HEIGHT - BUTTON_MARGIN, {
      click: function() {
        return this.$window.onOK.apply(this, arguments);
      }
    });
    this.addButton('キャンセル', BUTTON_WIDTH, BUTTON_HEIGHT, this.width - BUTTON_WIDTH - BUTTON_MARGIN - BUTTON_WIDTH - BUTTON_MARGIN, this.height - BUTTON_HEIGHT - BUTTON_MARGIN, {
      click: function() {
        this.$window.onCancel.apply(this, arguments);
        return this.close();
      }
    });
    stop = callback != null ? callback.call(this) : void 0;
    if (stop !== false) {
      this.show();
    }
  }

  WindowUI.prototype.close = function(value) {
    return this.window.close(value);
  };

  WindowUI.prototype.show = function() {
    this.window.show();
    return this;
  };

  WindowUI.prototype.hide = function() {
    this.window.hide();
    return this;
  };

  WindowUI.prototype.center = function() {
    this.window.center();
    return this;
  };

  WindowUI.prototype.addControl = function(type, width, height, left, top, options, events) {
    var $ctrl, callback, event;
    $ctrl = new ControlUI(this, type, width, height, left, top, options);
    if (events != null) {
      for (event in events) {
        if (!__hasProp.call(events, event)) continue;
        callback = events[event];
        $ctrl.on(event, callback);
      }
    }
    this.controls.push($ctrl);
    return $ctrl;
  };

  WindowUI.prototype.addText = function(text, width, height, left, top, events) {
    if (text == null) {
      text = '';
    }
    return this.addControl('statictext', width, height, left, top + 2, [text], events);
  };

  WindowUI.prototype.addTextbox = function(width, height, left, top, defaultText, events) {
    if (defaultText == null) {
      defaultText = '';
    }
    return this.addControl('edittext', width, height, left, top, [defaultText], events);
  };

  WindowUI.prototype.addButton = function(label, width, height, left, top, events) {
    return this.addControl('button', width, height, left, top, [label], events);
  };

  WindowUI.prototype.addRadio = function(label, width, height, left, top, events) {
    return this.addControl('radiobutton', width, height, left, top, [label], events);
  };

  WindowUI.prototype.addCheckbox = function(label, width, height, left, top, events) {
    return this.addControl('checkbox', width, height, left, top, [label], events);
  };

  WindowUI.prototype.ok = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.onOK = callback;
    return this;
  };

  WindowUI.prototype.cancel = function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    this.onCancel = callback;
    return this;
  };

  return WindowUI;

})();

DialogUI = (function(_super) {

  __extends(DialogUI, _super);

  function DialogUI(name, width, height, options, callback) {
    this.name = name;
    this.width = width;
    this.height = height;
    DialogUI.__super__.constructor.call(this, 'dialog', this.name, this.width, this.height, options, callback);
  }

  return DialogUI;

})(WindowUI);

$.level = 1;

preferences.rulerUnits = Units.PIXELS;

originalWidth = 0;

originalHeight = 0;

currentWidth = 0;

currentHeight = 0;

boundsOffsetX = 0;

boundsOffsetY = 0;

offsetX = 0;

offsetY = 0;

saveFolder = null;

nameCounter = 0;

structures = [];

fileNames = {};

fileNameCounter = 0;

getLayerPath = function(layer) {
  var getLayerName, path;
  path = [];
  getLayerName = function(layer) {
    path.push(layer.name);
    if (layer.parent) {
      getLayerName(layer.parent);
    }
  };
  getLayerName(layer);
  path.shift();
  path.pop();
  path.pop();
  path.reverse();
  return encodeURI('/' + path.join('/'));
};

close = function(showDialog) {
  if (showDialog == null) {
    showDialog = false;
  }
  if (showDialog) {
    if (!confirm('閉じてよろしいですか?')) {
      return;
    }
  }
  activeDocument.close(SaveOptions.DONOTSAVECHANGES);
};

getBounds = function(layer) {
  var bounds;
  bounds = layer.bounds;
  return {
    x: parseInt(bounds[0], 10),
    y: parseInt(bounds[1], 10),
    x2: parseInt(bounds[2], 10),
    y2: parseInt(bounds[3], 10)
  };
};

enlargeForSelect = function(layer) {
  var bounds;
  bounds = getBounds(layer);
  if (bounds.x < 0) {
    currentWidth -= bounds.x;
    boundsOffsetX += bounds.x;
    activeDocument.resizeCanvas(currentWidth, currentHeight, AnchorPosition.TOPRIGHT);
  }
  if (bounds.y < 0) {
    currentHeight -= bounds.y;
    boundsOffsetY += bounds.y;
    activeDocument.resizeCanvas(currentWidth, currentHeight, AnchorPosition.BOTTOMLEFT);
  }
  if (bounds.x2 > currentWidth + boundsOffsetX) {
    currentWidth += bounds.x2 + boundsOffsetX;
    activeDocument.resizeCanvas(currentWidth, currentHeight, AnchorPosition.TOPLEFT);
  }
  if (bounds.y2 > currentHeight + boundsOffsetY) {
    currentHeight += bounds.y2 + boundsOffsetY;
    activeDocument.resizeCanvas(currentWidth, currentHeight, AnchorPosition.TOPLEFT);
  }
  return bounds;
};

restoreDimension = function() {
  activeDocument.resizeCanvas(originalWidth - boundsOffsetX, originalHeight - boundsOffsetY, AnchorPosition.TOPLEFT);
  return activeDocument.resizeCanvas(originalWidth, originalHeight, AnchorPosition.BOTTOMRIGHT);
};

isSelect = function() {
  var flag, _level;
  flag = true;
  _level = $.level;
  $.level = 0;
  try {
    activeDocument.selection.translate(0, 0);
  } catch (e) {
    $.level = _level;
    return flag = false;
  } finally {
    $.level = _level;
    return flag;
  }
};

copy = function(layer) {
  var black, bounds, dot, fillTransparent;
  bounds = enlargeForSelect(layer);
  activeDocument.selection.select([[bounds.x, bounds.y], [bounds.x + 1, bounds.y], [bounds.x + 1, bounds.y + 1], [bounds.x, bounds.y + 1]]);
  fillTransparent = false;
  if (!isSelect()) {
    black = new SolidColor;
    black.model = ColorModel.RGB;
    black.red = 0;
    black.green = 0;
    black.blue = 0;
    dot = activeDocument.artLayers.add();
    activeDocument.activeLayer = dot;
    activeDocument.selection.fill(black, ColorBlendMode.NORMAL, 100, false);
    fillTransparent = true;
  }
  activeDocument.selection.deselect();
  selectAllLayers();
  activeDocument.selection.select([[bounds.x, bounds.y], [bounds.x2, bounds.y], [bounds.x2, bounds.y2], [bounds.x, bounds.y2]]);
  activeDocument.selection.copy(true);
  activeDocument.selection.deselect();
  activeDocument.activeLayer = layer;
  if (dot) {
    dot.remove();
  }
  dot = null;
  return fillTransparent;
};

paste = function(doc, fillTransparent) {
  var layer;
  doc.paste();
  layer = activeDocument.activeLayer;
  layer.translate(-layer.bounds[0], -layer.bounds[1]);
  if (fillTransparent) {
    activeDocument.selection.select([[0, 0], [1, 0], [1, 1], [0, 1]]);
    activeDocument.selection.clear();
  }
  activeDocument.selection.deselect();
  doc = null;
};

getMetrics = function(layer) {
  var bounds;
  bounds = getBounds(layer);
  return {
    x: bounds.x + boundsOffsetX + offsetX,
    y: bounds.y + boundsOffsetY + offsetY,
    width: bounds.x2 - bounds.x,
    height: bounds.y2 - bounds.y
  };
};

createDocument = function(width, height, name) {
  return documents.add(width, height, 72, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
};

hideLayerWithoutSelf = function(layer) {
  var parent, sub, _i, _len, _ref;
  parent = layer.parent;
  if (parent && parent.layers) {
    _ref = parent.layers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sub = _ref[_i];
      if (sub.visible) {
        sub.name += "__v__";
        sub.visible = false;
      }
    }
    hideLayerWithoutSelf(parent);
  }
  layer.visible = true;
  return layer.name = layer.name.replace(/__v__$/i, '');
};

showLayer = function(layer) {
  var parent, sub, _i, _len, _ref;
  parent = layer.parent;
  if (parent && parent.layers) {
    _ref = parent.layers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sub = _ref[_i];
      if (/__v__$/i.test(sub.name)) {
        sub.visible = true;
        sub.name = sub.name.replace(/__v__$/i, '');
      }
    }
    return showLayer(parent);
  }
};

extract = function(layer, mix, extFlag) {
  var data, dir, ext, fillTransparent, metrics, name, newDoc, url;
  name = layer.name;
  if (ext = name.match(/(\.(?:jpe?g|gif|png))$/i)) {
    ext = ext[0];
    name = name.replace(ext, '');
  }
  if (extFlag) {
    ext = '.' + extFlag;
  }
  if (!mix) {
    hideLayerWithoutSelf(layer);
  }
  dir = getLayerPath(layer);
  name = name.replace(/^[0-9]/, 'image$0').replace(/[^a-z0-9_\.:-]/gi, '');
  if (name === 'image') {
    name = 'image_' + nameCounter++;
  }
  if (fileNames[dir + name]) {
    name += fileNameCounter++;
  }
  fileNames[dir + name] = true;
  fillTransparent = copy(layer);
  metrics = getMetrics(layer);
  newDoc = createDocument(metrics.width, metrics.height, layer.name);
  paste(newDoc, fillTransparent);
  if (ext === '.jpeg' || ext === '.jpg') {
    url = saveJPEG(name, dir);
  } else if (ext === '.gif') {
    url = saveGIF(name, dir);
  } else {
    url = savePNG(name, dir);
  }
  newDoc.close(SaveOptions.DONOTSAVECHANGES);
  data = metrics;
  data.name = name;
  data.url = url;
  structures.push(data);
  if (!mix) {
    showLayer(layer);
  }
};

output = function(layers, ext, mix) {
  var layer, _i, _len;
  for (_i = 0, _len = layers.length; _i < _len; _i++) {
    layer = layers[_i];
    if (layer.typename === 'LayerSet' && layer.visible) {
      output(layer.layers, mix, ext);
    } else {
      if (layer.visible && layer.kind === LayerKind.SMARTOBJECT) {
        extract(layer, mix, ext);
      }
    }
  }
};

exec = function(typeFlag, ext, saveFolderPath, mix) {
  var FLAG_CSS, FLAG_JQUERY, FLAG_JSFL, FLAG_JSON, FLAG_LESS, layers;
  if (saveFolderPath == null) {
    saveFolderPath = '~/';
  }
  if (mix == null) {
    mix = false;
  }
  originalWidth = activeDocument.width;
  originalHeight = activeDocument.height;
  currentWidth = originalWidth;
  currentHeight = originalHeight;
  saveFolder = new Folder(saveFolderPath);
  layers = activeDocument.layers;
  output(layers, ext, mix);
  restoreDimension();
  structures.reverse();
  FLAG_CSS = 1;
  FLAG_JSON = 2;
  FLAG_LESS = 4;
  FLAG_JQUERY = 8;
  FLAG_JSFL = 16;
  if (typeFlag & FLAG_CSS) {
    outputCSS(structures);
  }
  if (typeFlag & FLAG_LESS) {
    outputLESS(structures);
  }
  if (typeFlag & FLAG_JQUERY) {
    outputJQUERY(structures);
  }
  if (typeFlag & FLAG_JSON) {
    outputJSON(structures);
  }
  alert('Complete!!\nお待たせしました。終了です。');
};

input = function() {
  var $dialog;
  return $dialog = new DialogUI('PSD to HTML', 700, 430, null, function() {
    var $gif, $mix, $offsetX, $offsetY, $png, $saveFolder, $types;
    this.addText('書き出しフォルダ', 120, 20, 10, 50);
    $saveFolder = this.addTextbox(540, 20, 60, 70);
    $saveFolder.val(activeDocument.path + '/' + activeDocument.name.replace(/\.[a-z0-9_]+$/i, '') + '/');
    this.addButton('選択', 80, 20, 610, 70, {
      click: function() {
        saveFolder = Folder.selectDialog('保存先のフォルダを選択してください');
        if (saveFolder) {
          return $saveFolder.val(decodeURI(saveFolder.getRelativeURI('/')));
        }
      }
    });
    this.addText('書き出し形式', 120, 20, 10, 160);
    $types = [];
    $types.push(this.addCheckbox('HTML＆CSS', 140, 20, 10 + 140 * 0, 190));
    $types.push(this.addCheckbox('JSON', 140, 20, 10 + 140 * 1, 190));
    $types.push(this.addCheckbox('LESS＆SASS', 140, 20, 10 + 140 * 2, 190));
    $types.push(this.addCheckbox('jQuery', 140, 20, 10 + 140 * 3, 190));
    $types.push(this.addCheckbox('JSFL', 140, 20, 10 + 140 * 4, 190));
    this.addText('オプション', 120, 20, 10, 230);
    $mix = this.addCheckbox('背景やバウンディングボックスの範囲に入るオブジェクトも含めて書きだす。', 600, 20, 10, 260);
    $png = this.addRadio('全ての画像を強制的にPNGで書き出す。', 600, 20, 10, 290);
    $gif = this.addRadio('全ての画像を強制的にGIFで書き出す。', 600, 20, 10, 320);
    this.addText('ドキュメントの原点のオフセットX', 300, 20, 10, 350);
    $offsetX = this.addTextbox(40, 20, 190, 350);
    $offsetX.val(0);
    this.addText('px', 300, 20, 235, 350);
    this.addText('ドキュメントの原点のオフセットY', 300, 20, 310, 350);
    $offsetY = this.addTextbox(40, 20, 490, 350);
    $offsetY.val(0);
    this.addText('px', 300, 20, 535, 350);
    return this.ok(function() {
      var $type, ext, i, saveFolderPath, typeFlag, _i, _len;
      saveFolderPath = encodeURI($saveFolder.val());
      typeFlag = 0;
      for (i = _i = 0, _len = $types.length; _i < _len; i = ++_i) {
        $type = $types[i];
        if ($type.val()) {
          typeFlag += Math.pow(2, i);
        }
      }
      if ($png.val()) {
        ext = 'png';
      }
      if ($gif.val()) {
        ext = 'gif';
      }
      offsetX = parseInt($offsetX.val(), 10) * -1 || 0;
      offsetY = parseInt($offsetY.val(), 10) * -1 || 0;
      this.close();
      return exec(typeFlag, ext, saveFolderPath, $mix.val());
    });
  });
};

if (documents.length) {
  savable = true;
  _level = $.level;
  $.level = 0;
  try {
    activeDocument.path;
  } catch (err) {
    alert('保存してください\nこのドキュメントは一度も保存されていません。\nドキュメントを保存後に再実行してください。');
    savable = false;
  }
  $.level = _level;
  if (savable) {
    if (activeDocument.saved) {
      input();
    } else {
      if (confirm('ドキュメントが保存されていません。\n保存しますか？')) {
        activeDocument.save();
      }
      input();
    }
  }
} else {
  alert('ドキュメントが開かれていません\n対象のドキュメントが開かれていません。');
}
