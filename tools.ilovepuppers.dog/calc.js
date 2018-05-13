(function () {
        // Add slider and event handler
        $('#cargo-slider').slider({
            min: 0,
            max: 340000,
            step: 5000,
            tooltip: 'hide',
            ticks: [0, 340000],
            ticks_labels: ['0', '340000'],
            handle: 'round'
        }).change(function () {
            $('#cargo').val($('#cargo-slider').val());
            $('#cargo-input').val("");
        }).slider('setValue', 100000);

        // Add cargo size input handler
        $('#cargo').on('input', function() {
            var cargoVal = $('#cargo').val();
            if (cargoVal >= 0 && cargoVal <= 350000) {
                $('#cargo-slider').slider('setValue', cargoVal);
            }
        })
        $('#cargo').val(100000);

        // Add collection and destination options from the JSON object
        var collectionOptions = "", destinationOptions = "";
        var sources = [];
        var destinations = [];
        Object.keys(rates).forEach(key => {
            sources.push(key);
            Object.keys(rates[key]).forEach(destKey => {
                destinations.push(destKey);
            });
        });
        let setDestinations = _.uniq(destinations);

        sources.forEach(source => {
            collectionOptions += '<option value="' + source + '">' + source + '</option>';
        });
        setDestinations.forEach(destination => {
            destinationOptions += '<option value="' + destination + '">' + destination + '</option>';
        })

        $("#collection").append(collectionOptions);
        $("#destination").append(destinationOptions);

        // Add rate event handlers
        $('#collection').change(function() {
            $('#rate').val(getRate($('#collection').val(), $('#destination').val()));
        });
        $('#destination').change(function() {
            $('#rate').val(getRate($('#collection').val(), $('#destination').val()));
        })

        function getRate(col, dest) {
            var rate = 0;
            if (_.includes(Object.keys(rates), col) && _.includes(Object.keys(rates[col]), dest)) {
                rate = rates[col][dest];
            }
            return rate;
        }
        
        $('#calculate-button').click(function() {
            let cargoSize = $('#cargo').val();

            if (cargoSize == 0) {
                $('#cargo-alert').css('display', 'block');
            } else {
                $('#cargo-alert').css('display', 'none');
            }

            let rate = getRate($('#collection').val(), $('#destination').val()) * cargoSize;
            if (rate == 0) {
                $('#alert').css('display', 'block');
            } else {
                $('#alert').css('display', 'none');
                let finalRate = rate >= 5000000 ? rate : 5000000;
                $('#result').val(finalRate.toLocaleString());
            }
        })
    }());
