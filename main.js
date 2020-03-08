"use strict;";

class MainPage {
  constructor() {}

  get get_was_count_node() {
    return document.getElementsByClassName("node").length;
  }

  get get_count_node() {
    return document.getElementById("inputGenerateObjects").value;
  }

  get get_now_count_node() {
    F = new Field();
    return F.object_inside.length;
  }

  get select_node() {
    return document.getElementsByClassName('mark')[0];
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

class TopSetting extends MainPage {
  constructor(count_node) {
    super();
    this.count_node = count_node;
  }

  showInputGenerateObjects() {
    var button_input = document.getElementById("buttonGenerateObjects");
    var input_val = document.getElementById("inputGenerateObjects");
    if (
      button_input.textContent == "push" ||
      button_input.textContent == "append"
    ) {
      button_input.style.backgroundColor = "rgba(0,0,0,.7)";
      input_val.style.display = "none";
      button_input.textContent = "append";
      BPT = new BottomPanelTools();
      BPT.create_set_nodes(parseInt(this.get_count_node));
      let reset_value = function() {
        button_input.textContent = "push";
        button_input.style.backgroundColor = "rgba(0,0,0,0)";
        input_val.style.display = "inline";
      };
      setTimeout(reset_value, 1000);
    } else {
      button_input.textContent = "push";
      button_input.style.width = "150px";
      input_val.setAttribute("value", this.count_node);
      input_val.setAttribute("type", "number");
    }
  }
}
TS = new TopSetting(10);

class BottomPanelTools extends MainPage {
  constructor() {
    super();
  }

  create_set_nodes(count_node) {
    let was_count_nodes = this.get_was_count_node;
    let need_count_nodes = was_count_nodes + parseInt(count_node);
    var start_tag = document.getElementById("init_date");
    var new_div, old_p, new_p, new_br;

    if (
      document.getElementById("auto_p") == null ||
      typeof document.getElementById("auto_p") == "undefined"
    ) {
      old_p = document.createElement("P");
      old_p.setAttribute("id", "auto_p");
      start_tag.after(old_p);
    } else {
      old_p = document.getElementById("auto_p");
    }
    for (let i = was_count_nodes; i < need_count_nodes; i++) {
      new_div = document.createElement("DIV");
      new_div.setAttribute("class", "node");
      if (i != 0 && i % 10 == 0) {
        new_br = document.createElement("BR");
        old_p.after(new_br);
        new_p = document.createElement("P");
        new_p.setAttribute("id", "auto_p");
        new_br.after(new_p);
        new_p.after(new_div);
      }
      old_p.after(new_div);
    }
    document.getElementById(
      "show_total_count_nodes"
    ).innerHTML = need_count_nodes;
    document.getElementById("show_now_count_nodes").innerHTML =
      this.get_was_count_node - this.get_now_count_node;
  }
}
BPT = new BottomPanelTools();

class Field extends MainPage {
  constructor() {
    super();
  }

  get rect_border_field() {
    return document.getElementById("field").getBoundingClientRect();
  }

  get object_inside() {
    let elems = document.getElementsByClassName("node draggable");
    let include_elems = [];
    for (let i = 0; i < elems.length; i++) {
      let rect_elem = elems[i].getBoundingClientRect();
      if (
        this.rect_border_field.left < rect_elem.left &&
        this.rect_border_field.right > rect_elem.right &&
        this.rect_border_field.top < rect_elem.top &&
        this.rect_border_field.bottom > rect_elem.bottom
      ) {
        include_elems.push(elems[i]);
      }
    }
    return include_elems;
  }

  change_state_field() {
    this.view_count_elems_field();
    let nodes_include = this.object_inside;
    this.one_elem_click_processing(nodes_include);
  }

  one_elem_click_processing(nodes_include) {
    for (let i = 0; i < nodes_include.length; i++) {
      nodes_include[i].setAttribute("class", "node draggable field");
    }
  }

  view_count_elems_field() {
    document.getElementById(
      "show_count_nodes_field"
    ).innerHTML = this.object_inside.length;
    document.getElementById("show_now_count_nodes").innerHTML =
      this.get_was_count_node - this.get_now_count_node;
  }
}

F = new Field();


class Interaction {
  constructor() {
    this.itemMove = false;
    this.itemElement = null;
    this.offsetX;
    this.offsetY;
  }

  event_listens() {
    document.body.addEventListener("mousedown", function(e) {
      if (e.target.classList.contains("node")) {
        e.preventDefault();
        e.target.setAttribute("class", "node draggable");
        this.itemMove = true;
        this.itemElement = e.target;
        const itemRect = this.itemElement.getBoundingClientRect();
        this.itemElement.style.position = "absolute";
        this.offsetX = e.clientX - itemRect.x;
        this.offsetY = e.clientY - itemRect.y;
        new Interaction().moveItemToXY(this.itemElement, e.x, e.y, this.offsetX, this.offsetY);
        this.itemElement.ondragstart = function(e) {
          return false;
        };
      }
    });

    document.body.addEventListener("mousemove", function(e) {
      if (!this.itemMove) return false;
      if (e.buttons != 1) {
        this.itemMove = false;
        return;
      }
      new Interaction().moveItemToXY(this.itemElement, e.x, e.y, this.offsetX, this.offsetY);
      return false;
    });

    document.body.addEventListener("mouseup", function(e) {
      if (this.itemMove) this.itemMove = false;
      F = new Field();
      if (
        F.rect_border_field.left < e.x &&
        F.rect_border_field.right > e.x &&
        F.rect_border_field.top < e.y &&
        F.rect_border_field.bottom > e.y
      ) {
        F.change_state_field();
      }
    });
  }

  moveItemToXY(item, x, y, offX, offY) {
    let itemRect = item.getBoundingClientRect();
    const minX = 0,
      minY = 0,
      maxY = document.documentElement.clientHeight - item.offsetHeight,
      maxX = document.documentElement.clientWidth - item.offsetWidth;
    let itemX = x - offX,
      itemY = y - offY;
    if (itemX < minX) itemX = minX;
    if (itemY < minY) {
      window.scrollBy(0, itemY - minY);
      itemY = minY;
    }
    if (itemX > maxX) itemX = maxX;
    if (itemY > maxY) {
      window.scrollBy(0, itemY - maxY);
      itemY = maxY;
    }
    item.style.left = itemX + pageXOffset + "px";
    item.style.top = itemY + pageYOffset + "px";
  }
}

I = new Interaction();
I.event_listens();


class PopUp extends MainPage{
  constructor() {
    super();
  };

  select_popup_body() {
    return document.getElementById('popup_body');
  }

  select_popup_input() {
    return document.getElementById('popup_input');
  }

  select_popup_button() {
    return document.getElementById('popup_button');
  }

  processing_popup() {
    document.body.addEventListener("dblclick", function(e) {
      PU.double_click_proc(e);
    });
    document.body.addEventListener("mouseup", function(e) {
      PU.mouse_up_proc(e);
    });
  }

  double_click_proc(e) {
    // create popup if (ELEM at field) and (BODY) popups NOT EXIST
    if (e.target.classList.contains("field") && PU.select_popup_body() == null) {
      e.preventDefault();
      let one_node = e.target;
      one_node.setAttribute("class", "node draggable field mark");
      PU.create_popup();
    // else if (BODY) and (INPUT) popups EXIST
    } else if (PU.select_popup_body() && PU.select_popup_input()) {
      // save data and remove popup if MOUSE FOCUSES on (BUTTON) and (VALUE) EXIST
      if ((e.target.id == "popup_button") && PU.select_popup_input().value) {
        let value = PU.select_popup_input().value;
        PU.save_data(value);
        PU.remove_popup(false);
        PU.display_popup(value);
        PU.change_state_node();
      // change color if MOUSE FOCUSES on ((BUTTON or BODY) and (VALUE)) NOT EXIST
      } else if ((e.target.id == "popup_body" || e.target.id == "popup_button") && !(PU.select_popup_input().value)){
        PU.select_popup_body().style.backgroundColor = "rgba(255,50,50,0.5)";
      } else {
      // remove popup completely
        PU.remove_popup(true);
      }
    // else if only (BODY) popups EXIST
    } else if (PU.select_popup_body() && !PU.select_popup_input()) {
      // if MOUSE FOCUSES on (BODY)
      if (e.target.id == "popup_body"){
        e.target.parentElement.setAttribute("class", "node draggable field mark");
        PU.remove_popup(true);
        PU.create_popup();
      // if MOUSE NOT FOCUSES on (BODY)
      } else {
        PU.remove_popup(true);
      }
    }
  }

  mouse_up_proc(e) {
    if (e.target.classList.contains("field")) {
      e.preventDefault();
      let one_node = e.target;
      one_node.textContent = "W";
      one_node.setAttribute("class", "node draggable field");
    }
  }

  create_popup() {
    let build_start = PU.select_node();
    let popup_body = document.createElement("DIV");
    popup_body.setAttribute("id", "popup_body");
    build_start.appendChild(popup_body);
    popup_body.style.position = "absolute";
    popup_body.style.top = (- parseFloat(popup_body.offsetHeight) - 10.0).toString() + "px";
    popup_body.style.left = (parseFloat(build_start.offsetWidth) / 2 - parseFloat(popup_body.offsetWidth) / 2 - 5).toString() + "px";
    let popup_input = document.createElement("INPUT");
    popup_input.setAttribute("id", "popup_input");
    popup_body.appendChild(popup_input);
    popup_input.style.position = "absolute";
    popup_input.style.top = "10px";
    popup_input.style.left = "10px";
    let popup_button = document.createElement("BUTTON");
    popup_button.setAttribute("id", "popup_button");
    popup_body.appendChild(popup_button);
    popup_button.innerHTML = "save";
    popup_button.style.position = "absolute";
    popup_button.style.top = "10px";
    popup_button.style.left = "70px";
  }

  display_popup(value) {
    let popup_body = PU.select_popup_body();
    popup_body.style.width = "60px";
    popup_body.style.height = "30px";
    popup_body.style.top = (parseFloat(popup_body.style.top) + 10.0).toString() + "px";
    popup_body.style.left = (parseFloat(popup_body.style.left) + 30.0).toString() + "px";
    for(let key of Object.keys(localStorage)) {
      if (localStorage.getItem(key).toString() == value.toString()){
        popup_body.textContent = "key: " + key;
      }
    }
    // popup_body.parentElement.textContent = value.toString();
  }

  remove_popup(without_width) {
    if (without_width) {
       PU.select_popup_body().remove();
    } else {
      PU.select_popup_input().remove();
      PU.select_popup_button().remove();
    }
  }

  save_data(value) {
    this.random_num = [];
    let random_value = this.getRandomInt(0, 100);
    while (this.random_num.includes(random_value)) {
      random_value = this.getRandomInt(0, 100);
    }
    this.random_num[this.random_num.length] = random_value
    localStorage.setItem(this.random_num[this.random_num.length - 1].toString(), value.toString());
  }

  change_state_node() {
    PU.select_node().setAttribute("class", "node draggable field mark save");
  }
}

PU = new PopUp();
PU.processing_popup();