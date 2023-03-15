todosMain();

function todosMain () {
  const DEFAULT_OPTIONS = "Choose category";
  //변수 선언
  let inTodo;
  let filterElem;
  let inCategory;
  let inputButton;
  let todoList = [];
  let dateInput;
  let timeInput;
  let sortBtn;
  let calendar;
  let checkedItem;
  let changeBtn;
  let todoTable;
  let dragItem;
  let modalCloseBtn;
  let endDateInput;
  let longSchedul;
  let longSchedulModal;
  let allDay;
  let endTimeInput;
  let modalEditEndDate;
  let modalEditTime;
  let modalAllDay;
  let modalEditEndTime;

  //기능
  getTodos();
  addTodos();
  initCalendar();
  load();
  renderRows(todoList);
  updateNewFilterCategorie();
  longSchedulHide();
  longSchedulModalHide();

  //투두스트 가져오기
  function getTodos() {
    inTodo = document.getElementsByTagName("input")[0];
    inCategory = document.getElementsByTagName("input")[1];
    inputButton = document.getElementById("inputBtn");
    filterElem = document.getElementById("todoFilter");
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    sortBtn = document.getElementById("sortBtn");
    checkedItem = document.getElementById("checkedItem");
    changeBtn = document.getElementById("changeBtn");
    todoTable = document.getElementById("todo-Table");
    modalCloseBtn = document.getElementById("modalCloseBtn");
    endDateInput = document.getElementById("endDateInput");
    longSchedul = document.getElementById("longSchedul");
    allDay = document.getElementById("allDay");
    endTimeInput = document.getElementById("endTimeInput");
    longSchedulModal = document.getElementById("longSchedulModal");
    modalEditEndDate = document.getElementById("modalEditEndDate");
    modalEditTime = document.getElementById("modalEditTime");
    modalEditEndTime = document.getElementById("modalEditEndTime");
    modalAllDay = document.getElementById("modalAllDay");
  }

  //투두리스트 추가
  function addTodos() {
    inputButton.addEventListener("click", addTodo, false);
    // filterElem.addEventListener("change", multipleFilters, false);
    sortBtn.addEventListener("click", sortDate, false);
    checkedItem.addEventListener("change", multipleFilters, false);
    modalCloseBtn.addEventListener("click",closeModalBox, false);
    changeBtn.addEventListener("click", commitEdit, false);
    todoTable.addEventListener("dragstart", onDragStart, false);
    todoTable.addEventListener("drop", onDrop, false);
    todoTable.addEventListener("dragover", onDragOver, false);
    longSchedul.addEventListener("change", longSchedulHide, false);
    longSchedulModal.addEventListener("change", longSchedulModalHide, false);
    allDay.addEventListener("change", allDayHide, false);
    modalAllDay.addEventListener("change", modalAllDayHide, false);
  } 
  
  //추가
  function addTodo(event) {
    let inTodoVal = inTodo.value;
    inTodo.value = "";
    let inCategoryVal = inCategory.value;
    inCategory.value = "";
    let inDateVal = dateInput.value;
    dateInput.value = "";
    let inTimeVal = timeInput.value;
    timeInput.value = "";
    let inEndTimeVal = endTimeInput.value;
    endTimeInput.value = "";
    let endDateInputVal = endDateInput.value;
    endDateInput.value = "";
    let longSchedulVal = longSchedul.checked;
    longSchedul.checked = "";
    let allDayVal = allDay.checked;
    allDay.checked = "";
    // 종료 날짜 포멧
    let dateTemp = new Date(endDateInputVal);
    let yearTemp = dateTemp.getFullYear();
    let monthTemp = dateTemp.getMonth() + 1;
    let dayTemp = dateTemp.getDate()+1;
    let paddedMonthTmp = monthTemp.toString();
    if (paddedMonthTmp.length < 2){
      paddedMonthTmp = "0" + paddedMonthTmp;
    }
    let paddedDateTmp = dayTemp.toString();
    if (paddedDateTmp.length < 2){
      paddedDateTmp = "0" + paddedDateTmp;
    }
    let packingEndDate = `${yearTemp}-${paddedMonthTmp}-${paddedDateTmp}`
    let inEndDateVal;
    if (packingEndDate != "NaN-NaN-NaN"){
      inEndDateVal = packingEndDate;
    }else{
      inEndDateVal = "";
    }
    if (inTodoVal == "" || inDateVal== ""){
      alert("설정을 다시 확인해 주세요");
      longSchedulHide();
      allDayHide();
      return false;
    }

    if (allDayVal == false && longSchedulVal == false && inEndTimeVal != ""){
      let inTimeErrB = inTimeVal.split(":").join("");
      let endTuimErrB = inEndTimeVal.split(":").join("");
      if (inTimeErrB > endTuimErrB){
        alert("시간 설정이 잘못 설정 되었습니다");
        longSchedulHide();
        allDayHide();
        return false;
      }
    }
    if(allDayVal == false && longSchedulVal == false && inEndTimeVal == "" && inTimeVal == ""){
      alert("시간 설정을 하지 않았습니다");
      longSchedulHide();
      allDayHide();
      return false;
    }

    if (longSchedulVal == true){
      let inDateErr = inDateVal.split("-").join("");
      let inEndDateErr = inEndDateVal.split("-").join("");
      if (inDateErr >= inEndDateErr){
        alert("날짜 설정이 잘못 설정 되었습니다");
        longSchedulHide();
        allDayHide();
        return false;
      }else if ((inEndDateErr - inDateErr)<=1){
        alert("하루 종일 시간 Check로 설정해 주세요");
        longSchedulHide();
        allDayHide();
        return false;
      }
    } 

    let obj = {
      id :  _uuid(),
      todo : inTodoVal,
      category : inCategoryVal,
      date : inDateVal,
      endDate : inEndDateVal,
      time : inTimeVal,
      endTime : inEndTimeVal,
      done : false,
      allDay : allDayVal,
      longSchedul : longSchedulVal,
    };
    renderRow(obj)
    todoList.push(obj);
    save();
    updateNewFilterCategorie();
    eventAddCalendar(obj);
    longSchedulHide();
    allDayHide();
  }
  
  //분류 자동 업데이트
  function updateNewFilterCategorie() {
    let options = [];
    todoList.forEach((obj) => {
      options.push(obj.category);
    });

    // let optionSet = new Set(options);
    // filterElem.innerHTML = "";
    
    // let newFilterCategorie = document.createElement('option');
    // newFilterCategorie.value = DEFAULT_OPTIONS;
    // newFilterCategorie.innerText = DEFAULT_OPTIONS;
    // filterElem.appendChild(newFilterCategorie);

    // for (let option of optionSet){
    //   let newFilterCategories = document.createElement('option');
    //   newFilterCategories.value = option;
    //   newFilterCategories.innerText = option;
    //   filterElem.appendChild(newFilterCategories);
    // };
  }

  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    if (todoList == null) {
      todoList =[];
    }
  }

  function renderRows(arr) {
    arr.forEach(eventAddCalendar);
    arr.forEach((todoObj) => {
      renderRow(todoObj);
    });
  }

  function renderRow({todo: inTodoVal, category: inCategoryVal, id, date, endDate, time, endTime, allDay, longSchedul, done}) {
    let trElem = document.createElement("tr");
    todoTable.appendChild(trElem);
    trElem.draggable = "true";
    trElem.dataset.id = id;

    //checkedBox
    let checkedBoxTodo = document.createElement("input");
    checkedBoxTodo.type = "checkbox";
    checkedBoxTodo.className = "checkFc";
    checkedBoxTodo.addEventListener("click", completeTodo, false);
    checkedBoxTodo.dataset.id = id;
    let tdCheckBox = document.createElement("td");
    tdCheckBox.appendChild(checkedBoxTodo);
    trElem.appendChild(tdCheckBox);

    // //날짜 리스트업
    let tdDateList = document.createElement("td");
    tdDateList.innerText = date;
    trElem.appendChild(tdDateList);

    // //종료날짜 리스트업
    let tdEndDateList = document.createElement("td");

    if (endDate != ""){
      let tdDateTemp = new Date(endDate);
      let tdYearTemp = tdDateTemp.getFullYear();
      let tdMonthTemp = tdDateTemp.getMonth() + 1;
      let tdDayTemp = tdDateTemp.getDate()-1;
      let tdPaddedMonthTmp = tdMonthTemp.toString();
      if (tdPaddedMonthTmp.length < 2){
        tdPaddedMonthTmp = "0" + tdPaddedMonthTmp;
      }
      let tdPaddedDayTmp = tdDayTemp.toString();
      if (tdPaddedDayTmp.length < 2){
        tdPaddedDayTmp = "0" + tdPaddedDayTmp;
      }
      let tdPackingEndDate = `${tdYearTemp}-${tdPaddedMonthTmp}-${tdPaddedDayTmp}`
        // tdEndDateList.innerText = endDate;
      tdEndDateList.innerText = tdPackingEndDate;
    }
    trElem.appendChild(tdEndDateList);
    
    // //시간 리스트업
    let tdTimeLiist = document.createElement("td");
    tdTimeLiist.innerText = time;
    trElem.appendChild(tdTimeLiist);

    // //시간 리스트업
    let tdEndTimeLiist = document.createElement("td");
    tdEndTimeLiist.innerText = endTime;
    trElem.appendChild(tdEndTimeLiist);

    //할일 리스트업
    let tdTodoList = document.createElement("td");
    tdTodoList.innerText = inTodoVal;
    trElem.appendChild(tdTodoList);

    // //카테고리 리스트업
    // let tdCategory = document.createElement("td");
    // tdCategory.innerText = inCategoryVal;
    // tdCategory.className = "category";
    // trElem.appendChild(tdCategory);

    //애딧 셀
    let editElem = document.createElement("span");
    editElem.innerText = "edit"
    editElem.className = "material-symbols-sharp";
    editElem.className += " editFc"
    editElem.addEventListener("click", toEditItem, false);
    editElem.dataset.id = id;
    let editTd = document.createElement("td");
    editTd.appendChild(editElem);
    trElem.appendChild(editTd);
    
    // //제거 아이콘 span태그를 부모테그에 달기
    let spanElem = document.createElement("span");
    spanElem.innerText = "close"
    spanElem.className = "material-symbols-sharp";
    spanElem.className += " deleteFc"
    // //제거 아이콘 span 태그를 누를경우 동작
    spanElem.addEventListener("click", deleteTodo, false);
    spanElem.dataset.id = id;
    let tdDelete = document.createElement("td");
    tdDelete.appendChild(spanElem);
    trElem.appendChild(tdDelete);

    checkedBoxTodo.type = "checkbox";
    checkedBoxTodo.checked = done;
    if (done){
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }

    //수정
    tdDateList.dataset.type = 'date'; 
    tdEndDateList.dataset.type = 'endDate';
    tdTimeLiist.dataset.type = 'time';
    tdEndTimeLiist.dataset.type = 'endTime';
    tdTodoList.dataset.type = "todo"; 
    // tdCategory.dataset.type = "category";
    
    tdDateList.dataset.id = id;
    tdEndDateList.dataset.id = id;
    tdTimeLiist.dataset.id = id;
    tdEndTimeLiist.dataset.id = id;
    tdTodoList.dataset.id = id;
    // tdCategory.dataset.id = id;   

    //삭제
    function deleteTodo() {
      trElem.remove();
      updateNewFilterCategorie();

      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList.splice(i, 1);
        }
      }
      save();

      let calendarEvent =  calendar.getEventById( this.dataset.id );
      if(calendarEvent !== null) {
        calendarEvent.remove();
      }
    }
    
    //완료 체크
    function completeTodo(){
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++){
        if(todoList[i].id == this.dataset.id){
          todoList[i]["done"] = this.checked;
        }
      }
      save();
      multipleFilters();
    }
  }

  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  //날짜 순으로 정리해주는 역활
  function sortDate() {
    todoList.sort((a,b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate-bDate
    });

    save();
    
    cleantable();

    renderRows(todoList);
  }

  // 켈린더 초기화
  function initCalendar() {
    let calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 560,
      selectable: true,
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev title next',
        // left: 'prev today',
        center: '',
        // right: ''
        // center: 'title',
        // right: 'next'
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [],
      eventClick: function(info) {
        toEditItem(info.event);
      },
      eventBorderColor : "#F79800",
      editable: true,
      eventDrop: function(info) {
        calendarEventDragged(info.event);
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        hour12: false
      }
    });
    calendar.render();
  }

  // 켈린더 일정 추가
  function eventAddCalendar({id, todo, date, endDate, time, endTime, longSchedul, allDay, done}){
    if (!done){
      if (longSchedul == true){
        calendar.addEvent({
          id: id,
          title: todo,
          start: date,
          end: endDate,
          backgroundColor : (done ? "#80808080" : "#00E5BF"),
        });
      }else{
        if(allDay == true){
          calendar.addEvent({
            id: id,
            title: todo,
            start: date,
            backgroundColor : (done ? "#80808080" : "#9D00F2"),
          });
        }else{
          calendar.addEvent({
            id: id,
            title: todo,
            start: `${date}T${time}`,
            end: `${date}T${endTime}`,
          });
        }
      }
    }
  }

  //확인완료 정리
  function cleantable(){
    let rows = todoTable.getElementsByTagName("tr");
    for(let i = rows.length-1; i > 0; i--) {
      rows[i].remove();
    }

    calendar.getEvents().forEach(event => event.remove());
  }

  //체크박스 정렬 && 카테고리 정령
  function multipleFilters() {
    cleantable();
    
    if (checkedItem.checked){
      let resultArr = [];
      let filterCompleteArr = todoList.filter(obj => obj.done == false);
      resultArr = [...filterCompleteArr]
      renderRows(resultArr);
    }else{
      renderRows(todoList);
    }

    // let choice = filterElem.value;
    // if (checkedItem.checked){
    //   let resultArr = [];
    //   let filterCompleteArr = todoList.filter(obj => obj.done == false);
    //   resultArr = [...filterCompleteArr]
    //   renderRows(resultArr);
    // }else{
    //   renderRows(todoList);
    // }
    // if (choice == DEFAULT_OPTIONS) {
    // }else {
    //   let filterCategoryArr = todoList.filter(obj => obj.category==choice);
    //   if (checkedItem.checked){
    //     let resultArr = [];
    //     let filterCompleteArr = filterCategoryArr.filter(obj => obj.done == false);
    //     resultArr = [...filterCompleteArr]
    //     renderRows(resultArr);
    //   }else{
    //     renderRows(filterCategoryArr);
    //   }
    // }
  }

  //항목 수정
  function onTableClick(event){
    if (event.target.matches("td") && event.target.dataset.editable == "true"){
      let tempInputEl;
      switch(event.target.dataset.type){
        case "date":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "date";
          tempInputEl.value = event.target.dataset.value;
          break;
        case "endDate":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "endDate";
          // tempInputEl.value = event.target.dataset.value;
          break;
        case "time":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "time";
          tempInputEl.value = event.target.innerText;
          break;
        case "endTime":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "endTime";
          tempInputEl.value = event.target.innerText;
          break;
        case "todo":
        case "category":
          tempInputEl = document.createElement("input");
          tempInputEl.value = event.target.innerText;
          break;
        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputEl);
      tempInputEl.addEventListener("change", onChange, false);
    }
    
    function onChange(event){
      let changedValue = event.target.value;
      let id = event.target.parentNode.dataset.id;
      let type = event.target.parentNode.dataset.type;

      calendar.getEventById(id).remove();

      todoList.forEach(todoObj => {
        if (todoObj.id == id){
          todoObj[type] = changedValue;

          eventAddCalendar({
            id : id,
            title : todoObj.todo,
            start : todoObj.date,
            end : todoObj.endDate,
          }); 
        }
      });
      save();

      if(type == "date"){
        event.target.parentNode.innerText = formatDate(changedValue);
      }else{
        event.target.parentNode.innerText = changedValue;
      }
    }
  }

  //날짜 포멧
  function formatDate (date) {
    let dateObj = new Date(date);
    let transDate = dateObj.toLocaleString("en-KR",{
      month : "numeric",
      day : "numeric",
      year : "numeric",
    });
    let tdDateTemp = new Date(date);
    let tdYearTemp = tdDateTemp.getFullYear();
    let tdMonthTemp = tdDateTemp.getMonth() + 1;
    let tdDayTemp = tdDateTemp.getDate();
    let tdPaddedMonthTmp = tdMonthTemp.toString();
    if (tdPaddedMonthTmp.length < 2){
      tdPaddedMonthTmp = "0" + tdPaddedMonthTmp;
    }
    let tdPaddedDayTmp = tdDayTemp.toString();
    if (tdPaddedDayTmp.length < 2){
      tdPaddedDayTmp = "0" + tdPaddedDayTmp;
    }
    let tdPackingEndDate = `${tdYearTemp}-${tdPaddedMonthTmp}-${tdPaddedDayTmp}`
    if (tdPackingEndDate != "NaN-NaN-NaN"){
      // tdEndDateList.innerText = endDate;
      transDate = tdPackingEndDate;
    }else{
      transDate = "";
    }
    // transDate = date;
    return transDate;
  }

  //종료날짜 포멧
  function formatEndDate (date) {
    let dateObj = new Date(date);
    let transDate = dateObj.toLocaleString("en-KR",{
      month : "numeric",
      day : "numeric",
      year : "numeric",
    });
    let tdDateTemp = new Date(date);
    let tdYearTemp = tdDateTemp.getFullYear();
    let tdMonthTemp = tdDateTemp.getMonth() + 1;
    let tdDayTemp = tdDateTemp.getDate()-1;
    let tdPaddedMonthTmp = tdMonthTemp.toString();
    if (tdPaddedMonthTmp.length < 2){
      tdPaddedMonthTmp = "0" + tdPaddedMonthTmp;
    }
    let tdPaddedDayTmp = tdDayTemp.toString();
    if (tdPaddedDayTmp.length < 2){
      tdPaddedDayTmp = "0" + tdPaddedDayTmp;
    }
    let tdPackingEndDate = `${tdYearTemp}-${tdPaddedMonthTmp}-${tdPaddedDayTmp}`
    if (tdPackingEndDate != "NaN-NaN-NaN"){
      // tdEndDateList.innerText = endDate;
      transDate = tdPackingEndDate;
    }else{
      transDate = "";
    }
    // transDate = date;
    return transDate;
  }

  //모달 상자 보이기
  function showModalBox(event){
    document.getElementById("overlayModalBox").classList.add("overlayIntoView");
  }

  //모달 상자 닫기
  function closeModalBox(event){
    document.getElementById("overlayModalBox").classList.remove("overlayIntoView");
  }

  //수정 완료
  function commitEdit(event){

    let id = event.target.dataset.id;
    let todo = document.getElementById("modalEditTodo").value;
    // let category = document.getElementById("modalEditCategory").value;
    let date = document.getElementById("modalEditDate").value;
    let endDatebuf = document.getElementById("modalEditEndDate").value;
    let time = document.getElementById("modalEditTime").value;
    let endTime = document.getElementById("modalEditEndTime").value;
    let allDayVal = document.getElementById("modalAllDay").checked
    let longSchedulVal = document.getElementById("longSchedulModal").checked
    let endDate;
    if (longSchedulVal == true){
      let dateTemp = new Date(endDatebuf);
      let yearTemp = dateTemp.getFullYear();
      let monthTemp = dateTemp.getMonth() + 1;
      let dayTemp = dateTemp.getDate()+1;
      let paddedMonthTmp = monthTemp.toString();
      if (paddedMonthTmp.length < 2){
        paddedMonthTmp = "0" + paddedMonthTmp;
      }
      let paddedDateTmp = dayTemp.toString();
      if (paddedDateTmp.length < 2){
        paddedDateTmp = "0" + paddedDateTmp;
      }
      let packingEndDate = `${yearTemp}-${paddedMonthTmp}-${paddedDateTmp}`
      
      if (packingEndDate != "NaN-NaN-NaN"){
        endDate = packingEndDate;
      }else{
        endDate = "";
      }
    }else{
      endDate = "";
    }
    if (allDayVal == true){
      time = ""
      endTime =""
    }
    //알람
    if (todo == "" || date== ""){
      alert("설정을 다시 확인해 주세요");
      longSchedulModalHide();
      modalAllDayHide();
      return false;
    }

    if (allDayVal == false && longSchedulVal == false && endTime != ""){
      let inTimeErrB = time.split(":").join("");
      let endTuimErrB = endTime.split(":").join("");
      if (inTimeErrB > endTuimErrB){
        alert("시간 설정이 잘못 설정 되었습니다");
        longSchedulModalHide();
        modalAllDayHide();
        return false;
      }
    }
    if(allDayVal == false && longSchedulVal == false && endTime == "" && time == ""){
      alert("시간 설정을 하지 않았습니다");
      longSchedulModalHide();
      modalAllDayHide();
      return false;
    }
    if (longSchedulVal == true){
      let inDateErr = date.split("-").join("");
      let inEndDateErr = endDate.split("-").join("");
      if (inDateErr >= inEndDateErr){
        alert("날짜 설정이 잘못 설정 되었습니다");
        longSchedulModalHide();
        modalAllDayHide();
        return false;
      }else if ((inEndDateErr - inDateErr)<=1){
        alert("하루 종일 시간 Check로 설정해 주세요");
        longSchedulModalHide();
        modalAllDayHide();
        return false;
      }
    } 

    closeModalBox();

    calendar.getEventById(id).remove();


    for (let i = 0; i < todoList.length; i++){
      if(todoList[i].id == id){
        todoList[i]={
          id : id,
          todo : todo,
          // category : category,
          date : date,
          endDate : endDate,
          time : time,
          endTime : endTime,
          done : false,
          allDay : allDayVal,
          longSchedul : longSchedulVal,
        };

        eventAddCalendar(todoList[i]); 
      }
    }

    save();

    let tdItemList = todoTable.querySelectorAll(`td[data-id='${id}']`);
    for (let i = 0; i < tdItemList.length; i++){
      let type = tdItemList[i].dataset.type;
      switch(type){
        case "date" :
          tdItemList[i].innerText = formatDate(date);
          break;
        case "endDate" :
          tdItemList[i].innerText = formatEndDate(endDate);
          break;
        case "time" :
          tdItemList[i].innerText = time;
          break;
        case "endTime" :
          tdItemList[i].innerText = endTime;
          break;
        case "todo" :
          tdItemList[i].innerText = todo;
          break;
        // case "category" :
        //   tdItemList[i].innerText = category;
        //   break;
      }
    }
  }

  //항목 수정
  function toEditItem(event){
    showModalBox();
    let id;

    if (event.target){
      id = event.target.dataset.id;
    } else {
      id = event.id;
    }
    
    preFillEditForm(id);

  }

  //수정창 값 채우기
  function preFillEditForm(id){
    let result = todoList.find(todoObj => todoObj.id == id);
    let {todo, category, date, endDate, time, endTime, allDay, longSchedul} = result;
    let modalFillDateTemp = new Date(endDate);
    let modalFillYearTemp = modalFillDateTemp.getFullYear();
    let modalFillMonthTemp = modalFillDateTemp.getMonth() + 1;
    let modalFillDayTemp = modalFillDateTemp.getDate()-1;
    let modalFillPaddedMonthTmp = modalFillMonthTemp.toString();
    if (modalFillPaddedMonthTmp.length < 2){
      modalFillPaddedMonthTmp = "0" + modalFillPaddedMonthTmp;
    }
    let modalFillPaddedDayTmp = modalFillDayTemp.toString();
    if (modalFillPaddedDayTmp.length < 2){
      modalFillPaddedDayTmp = "0" + modalFillPaddedDayTmp;
    }
    let modalFillPackingEndDate = `${modalFillYearTemp}-${modalFillPaddedMonthTmp}-${modalFillPaddedDayTmp}`
    let modalEndDate;
    if (modalFillPackingEndDate != "NaN-NaN-NaN"){
      // tdEndDateList.innerText = endDate;
      modalEndDate = modalFillPackingEndDate;
    }else{
      modalEndDate = "";
    }
    document.getElementById("longSchedulModal").checked = longSchedul;
    document.getElementById("modalAllDay").checked = allDay;
    if (longSchedul== true){
      longSchedulModalHide()
    }else{
      if(allDay== true){
        modalAllDayHide()
      }
      else{
        longSchedulModalHide()
      }
    }
    document.getElementById("modalEditTodo").value = todo;
    // document.getElementById("modalEditCategory").value = category;
    document.getElementById("modalEditDate").value = date;
    document.getElementById("modalEditEndDate").value = modalEndDate;
    document.getElementById("modalEditTime").value = time;
    document.getElementById("modalEditEndTime").value = endTime;
    changeBtn.dataset.id = id;
  }

  //항목 드레그
  function onDragStart (event) {
    dragItem = event.target;
  }

  //드래그 드랍
  function onDrop (event) {
    if(event.target.matches("table")){
      return;
    }

    let preTarget = event.target;

    while(!preTarget.matches("tr")){
      preTarget = preTarget.parentNode;
    }

    if(preTarget.matches(":first-child")){
      return;
    }

    todoTable.insertBefore(dragItem, preTarget);

    let bufIndex;
  
    todoList.forEach((todoObj, index) => {
      if (todoObj.id == dragItem.dataset.id){
        bufIndex = index;
      }
    });
  
    let [toInsertObj] = todoList.splice(bufIndex, 1);
  
    todoList.forEach((todoObj, index) => {
      if (todoObj.id == preTarget.dataset.id){
        bufIndex = index;
      }
    });
  
    todoList.splice(bufIndex, 0 ,toInsertObj);
  
    save();
  }
  
  //동작오류 방지
  function onDragOver(event){
    event.preventDefault();
  }

  //드레그시
  function calendarEventDragged(event){
    let id = event.id;
    
    let dateObj = new Date(event.start);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    
    let paddedMonth = month.toString();
    if (paddedMonth.length < 2){
      paddedMonth = "0" + paddedMonth;
    }
    let paddedDate = date.toString();
    if (paddedDate.length < 2){
      paddedDate = "0" + paddedDate;
    }
    let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;

    let endDateObj = new Date(event.end);
    let toStoreEDate;
    let eyear = endDateObj.getFullYear();
    let emonth = endDateObj.getMonth() + 1;
    let edate = endDateObj.getDate();
    let ehour = endDateObj.getHours();
    let eminute = endDateObj.getMinutes();
    let paddedEMonth = emonth.toString();
    if (paddedEMonth.length < 2){
      paddedEMonth = "0" + paddedEMonth;
    }
    let paddedEDate = edate.toString();
    if (paddedEDate.length < 2){
      paddedEDate = "0" + paddedEDate;
    }
    if(endDateObj != null && dateObj < endDateObj){
      toStoreEDate = `${eyear}-${paddedEMonth}-${paddedEDate}`;
      if ( edate - date <= -30){
        toStoreEDate = ""
      }
    }
    todoList.forEach(todoObj => {
      if(todoObj.id == id){
        todoObj.date = toStoreDate;
        if(hour == 00 && minute == 00 && ehour== 00 && eminute== 00){
          if(endDateObj != "" && dateObj < endDateObj){
            todoObj.endDate = toStoreEDate;
          }
        }
        if(hour !== 0)
          todoObj.time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        if(ehour !== 0 && event.allDay == false)
          todoObj.endTime = `${ehour.toString().padStart(2, "0")}:${eminute.toString().padStart(2, "0")}`;
      }
    });

    save();

    multipleFilters();
  }

  //숨기기
  function longSchedulHide() {
    let longSchedulStatus = longSchedul.checked;
    let timeRightClass = document.getElementsByClassName("timeRight")
    let displayEndDayClass = document.getElementsByClassName("displayEndDay")
    let timeLeftClass = document.getElementsByClassName("timeLeft")
    if (longSchedulStatus == true){
      for ( let i = 0; i < timeRightClass.length; i++){
        timeRightClass[i].style.cssText = "display : none"
        timeInput.value = "";
        endTimeInput.value = "";
      }
      for ( let i = 0; i < displayEndDayClass.length; i++){
        displayEndDayClass[i].style.cssText = "display : "
      }
      for ( let i = 0 ;  i < timeLeftClass.length; i++){
        timeLeftClass[i].style.cssText = "display : none"
        allDay.checked = false;
      }
    }
    if (longSchedulStatus == false){
      for ( let i = 0; i < displayEndDayClass.length; i++){
        displayEndDayClass[i].style.cssText = "display : none"
        endDateInput.value = "";
      }
      for ( let i = 0; i < timeRightClass.length; i++){
        timeRightClass[i].style.cssText = "display : "
      }
      for ( let i = 0 ;  i < timeLeftClass.length; i++){
        timeLeftClass[i].style.cssText = "display : "
      }
    }
  }

  function allDayHide (){
    let allDayStatus = allDay.checked;
    let timeRightClass = document.getElementsByClassName("timeRight")
    let displayEndDayClass = document.getElementsByClassName("displayEndDay")
    if (allDayStatus == true){
      for ( let i = 0; i < timeRightClass.length; i++){
        timeRightClass[i].style.cssText = "display : none"
        timeInput.value = "";
        endTimeInput.value = "";
      }
      for ( let i = 0; i < displayEndDayClass.length; i++){
        displayEndDayClass[i].style.cssText = "display : none"
      }
    }else{
      for ( let i = 0; i < timeRightClass.length; i++){
        timeRightClass[i].style.cssText = "display : "
      }
      for ( let i = 0; i < displayEndDayClass.length; i++){
        displayEndDayClass[i].style.cssText = "display : none"
        endDateInput.value = "";
      }
    }
  }

  function longSchedulModalHide() {
    let longSchedulModalStatus = longSchedulModal.checked;
    let timeRightModalClass = document.getElementsByClassName("timeRightModal")
    let diplayEndDateModalClass = document.getElementsByClassName("diplayEndDateModal")
    let timeLeftModalClass = document.getElementsByClassName("timeLeftModal")
    if (longSchedulModalStatus == true){
      for ( let i = 0; i < timeRightModalClass.length; i++){
        timeRightModalClass[i].style.cssText = "display : none"
        modalEditTime.value = "";
        modalEditEndTime.value = "";
      }
      for ( let i = 0; i < diplayEndDateModalClass.length; i++){
        diplayEndDateModalClass[i].style.cssText = "display : "
      }
      for ( let i = 0 ;  i < timeLeftModalClass.length; i++){
        timeLeftModalClass[i].style.cssText = "display : none"
        allDay.checked = false;
      }
    }
    if (longSchedulModalStatus == false){
      for ( let i = 0; i < diplayEndDateModalClass.length; i++){
        diplayEndDateModalClass[i].style.cssText = "display : none"
        modalEditEndDate.value = "";
      }
      for ( let i = 0; i < timeRightModalClass.length; i++){
        timeRightModalClass[i].style.cssText = "display : "
      }
      for ( let i = 0 ;  i < timeLeftModalClass.length; i++){
        timeLeftModalClass[i].style.cssText = "display : "
      }
    }
  }
    
  function modalAllDayHide(){
    let modalAllDayStatus = modalAllDay.checked;
    let timeRightModalClass = document.getElementsByClassName("timeRightModal")
    let diplayEndDateModalClass = document.getElementsByClassName("diplayEndDateModal")
    let timeLeftModalClass = document.getElementsByClassName("timeLeftModal")
    if (modalAllDayStatus == true){
      for ( let i = 0; i < timeRightModalClass.length; i++){
        timeRightModalClass[i].style.cssText = "display : none"
        modalEditTime.value = "";
        modalEditEndTime.value = "";
      }
      for ( let i = 0; i < diplayEndDateModalClass.length; i++){
        diplayEndDateModalClass[i].style.cssText = "display : none"
      }
    }
    if (modalAllDayStatus == false){
      for ( let i = 0; i < timeRightModalClass.length; i++){
        timeRightModalClass[i].style.cssText = "display : "
      }
      for ( let i = 0; i < diplayEndDateModalClass.length; i++){
        diplayEndDateModalClass[i].style.cssText = "display : none"
      }
      for ( let i = 0 ;  i < timeLeftModalClass.length; i++){
        timeLeftModalClass[i].style.cssText = "display : "
      }
    }
  }
}  