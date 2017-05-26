var Gestante = (function () {
    function disableButtons (buttons) {
        $.each(buttons, function (index, button) {
            $(button).addClass('disabled');
        });
    }

    function enableButtons (buttons) {
        $.each(buttons, function (index, button) {
            $(button).removeClass('disabled');
        });
    }


    function getRowData (row) {
        var data = {
            '_id' : row.attr('data-guid')
        };
        row.find('td').each(function (index, cell) {
            data[$(cell).attr('data-field')] = $(cell).attr('data-value');
        });
        return data;
    }

    function getSelectedRow () {
        return $('#list-gestante tbody tr.active');
    }

    function makeListRow() {
        var clonedRow = $("#row-base").clone();
        clonedRow.attr('id', '');
        clonedRow.find('td').text('').attr('data-value', '');
        clonedRow.attr('data-guid', '');
        return clonedRow;
    }

    function populateForm (data) {
        console.log(data);
        var keys = Object.keys(data);
        $.each(keys, function (index, field) {
            $('#form-gestante [name=' + field +']').val(data[field]);
        });
    }

    function populateListRow(row, data) {
        var keys = Object.keys(data);
        row.attr('data-guid', data['_id']);
        $.each(keys, function (index, field) {
            row.find('td[data-field=' + field +']').text(data[field]);
        });
    }

    function populateList(result) {
        var newRow = null;
        $("#list-gestante tbody").html("");
        console.log(result);
        for (var i = 0, count = result.length; i < count; i++) {
            newRow = makeListRow();
            console.log("New row");
            console.log(newRow);
            $("#list-gestante tbody").append(newRow);
            populateListRow(newRow, result[i]);
            newRow = null;
        }
    }

    function save () {
        var document = {};
        $.each($('#form-gestante input,select').serializeArray(), function (index, item) {
            document[item.name] = item.value;
        });
        console.log(document);
        $.ajax({
            url: '/gestante',
            method: 'POST',
            data: {'document': JSON.stringify(document)},
            dataType: 'json',
            success: function (response) {
                var selectedRow = getSelectedRow(), row = null;
                if (selectedRow.length > 0) {
                    row = selectedRow;
                } else {
                    row = makeListRow();
                    $("#list-gestante tbody").append(newRow);
                }
                populateListRow(row, response['document']);
                
                console.log("Response from Server");
                console.log(response);
            }
        });
    }

    function setSelectedRow(row) {
        getSelectedRow().removeClass('active');
        row.addClass('active');
    }

    function init () {
        $("#module-gestante").on('click', '#new', function (ev) {
            $("#modal-gestante")
            .modal({
                onShow: function () {
                    var selectedRow = getSelectedRow();
                    if (selectedRow) {
                        populateForm(getRowData(selectedRow));
                    }
                },
                onApprove: function () {
                    console.log("On save");
                    save();
                },
                onDenny: function () {
                    console.log("On Cancel");
                }
            })
            .modal('show');
        });

        $("#module-gestante").on('click', "#edit", function () {
            var selectedRowGUID = getSelectedRow().attr('data-guid');
            $.ajax({
                url: '/gestante/' + selectedRowGUID,
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    console.log("Document");
                    console.log(response['document']);
                    populateForm(response['document']);
                    $("#modal-gestante")
                    .modal({
                        onApprove: function () {
                            save();
                        }
                    })
                    .modal('show');
                }
            })
        });

        $("#module-gestante").on('click', '#delete', function (ev) {
            var selectedRowGUID = getSelectedRow().attr('data-guid');
            $.ajax({
                url: '/gestante/' + selectedRowGUID,
                method: 'DELETE',
                dataType: 'json',
                success: function (response) {
                    console.log("To Delete " + selectedRowGUID);
                    console.log($('#module-gestante').find('[data-guid=' + selectedRowGUID + ']'));
                    $('#module-gestante').find('[data-guid=' + selectedRowGUID + ']').remove();
                    console.log("Response from Server");
                    console.log(response);
                }
            });
        });

        $("#module-gestante").on('keypress', '#search-box', function (ev) {
            if (ev.which === 13) {
                console.log("Make Search");
                $.ajax({
                url: '/gestante/search/' + $(this).val(),
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    populateList(response['result']);
                    console.log("Search Result");
                    console.log(response)
                }
            });
            }
        });

        $("#module-gestante").on('click', '.item-row', function (ev) {
            console.log("Select row");
            setSelectedRow($(this));
            enableButtons(['#edit', '#delete']);
        });

        $("#module-gestante").on('click', '.item-row-checkbox', function (ev) {
            setSelectedRow($(this).getParents('tr'));
            enableButtons(['#delete']);
            disableButtons(['#edit']);
        });

    }

    init();

    return {
        save: save,
        init: init
    }
})();