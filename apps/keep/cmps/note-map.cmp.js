export default {
    name: 'note-map',
    props: ['info', 'isDetails'],
    template: `
        <section ref="gmap" class="map" style="width:100%;height:400px;">{{ Map }}</section>
        <!-- <input type="text" placeholder="search" ref="search" /> -->
        `,
    created() {},
    data() {
        return {
            map: {},
            service: null,
            infowindow: null,
            currLocation: null
        }
    },
    methods: {
        initMap(lat = 32.0845323, lng = 34.8130474) {
            var elMap = this.$refs.gmap
            var options = {
                center: {
                    lat,
                    lng
                },
                zoom: 15
            }

            this.map = new google.maps.Map(
                elMap,
                options
            )
            if (!this.isDetails) this.map.setOptions({ gestureHandling: "none", keyboardShortcuts: false })

            var request = {
                query: this.info.text,
                fields: ['name', 'geometry'],
            }

            this.service = new google.maps.places.PlacesService(this.map)
            const map = this.map
            this.service.findPlaceFromQuery(request, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach(result => {
                            var marker = new google.maps.Marker({
                                position: {
                                    lat: result.geometry.location.lat(),
                                    lng: result.geometry.location.lng()
                                },
                            })
                            marker.setMap(map)
                        })
                        map.setCenter(results[0].geometry.location)
                    }
                })
                // console.log(this.info);

            // var defaultBounds = new google.maps.LatLngBounds(
            //     new google.maps.LatLng(-33.8902, 151.1759),
            //     new google.maps.LatLng(-33.8474, 151.2631)
            // )

            // var elSearch = this.$refs.search
            // var searchBox = new google.maps.places.SearchBox(elSearch, {
            //     bounds: defaultBounds
            // })
            // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(elSearch)

            // searchBox.addListener("places_changed", () => {
            //     const places = searchBox.getPlaces();

            //     if (places.length == 0) {
            //         return
            //     }
            //     const bounds = new google.maps.LatLngBounds();
            //     places.forEach((place) => {
            //         if (!place.geometry || !place.geometry.location) {
            //             console.log("Returned place contains no geometry");
            //             return;
            //         }

            //         var marker = new google.maps.Marker({
            //             position: {
            //                 lat: place.geometry.location.lat(),
            //                 lng: place.geometry.location.lng()
            //             },
            //         })
            //         marker.setMap(this.map)

            //         if (place.geometry.viewport) {
            //             // Only geocodes have viewport.
            //             bounds.union(place.geometry.viewport);
            //         } else {
            //             bounds.extend(place.geometry.location);
            //         }
            //     })
            //     this.map.fitBounds(bounds)
            // })

        }
    },
    computed: {},
    components: {},
    mounted() {
        this.initMap()
    }
}