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
        var clonedRow = $("#list-gestante tbody tr:visible:first").clone();
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

    function save () {
        var document = {};
        $.each($('#form-gestante input').serializeArray(), function (index, item) {
            document[item.name] = item.value;
        });
        console.log(document);
        $.ajax({
            url: '/gestante',
            method: 'POST',
            data: {'document': JSON.stringify(document)},
            dataType: 'json',
            success: function (response) {
                var newRow = makeListRow();
                populateListRow(newRow, response['document']);
                $("#list-gestante tbody").append(newRow);
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
        $("#module-gestante").on('click', '#new, #edit', function (ev) {
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