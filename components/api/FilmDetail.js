import React from 'react'

import {StyleSheet, Platform, Share, TouchableOpacity ,Text, View, ActivityIndicator, ScrollView, Image } from 'react-native'
import {connect} from 'react-redux'
import {voir_film, getImageFromApi} from './tb'
import moment from 'moment'
import numeral from 'numeral'

class FilmDetail extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
    }

    componentDidMount(){
      const favoriteFilmIndex = this.props.favoriteFilms.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
      
      if(favoriteFilmIndex !== -1){
        this.setState({
          film: this.props.favoriteFilms[favoriteFilmIndex],
          isLoading: false
        })
        return
      }else{
       // this.setState({isLoading: true})
        voir_film(this.props.navigation.state.params.idFilm)
                  .then(data => {
                      this.setState({
                          film: data,
                          isLoading: false
                      })
                  })
      }

     
      }

      _shareFilm(){
        const {film} = this.state

        Share.share({
          title: film.title,
          message: film.overview
        })
      }

      getContact(){
        const {film} = this.state

        Share.share({
          title: film.title,
          message: film.overview
        })
      }

      _displayActionButton(){
        const {film} = this.state
        if(film !== undefined && Platform.OS === 'android'){
          return (
            <TouchableOpacity style={styles.share_touchable_floatingactionbutton}
              onPress={() => { this._shareFilm()} }
            >
              <Image style={styles.share_image} source={require('../images/plusVide.png')} />
            </TouchableOpacity>
          )
        }
       
      }

      _displayContactButton(){
        const {film} = this.state
        if(film !== undefined && Platform.OS === 'android'){
          return (
            <TouchableOpacity style={styles.share_touchable_floatingactionbutton}
              onPress={() => { this._shareFilm()} }
            >
              <Image style={styles.share_image} source={require('../images/contact.png')} />
            </TouchableOpacity>
          )
        }
       
      }

    _toggleFavorite (){
      const action = {
        type: 'TOGGLE_FAVORITE',
        value: this.state.film
      }
      this.props.dispatch(action)
    }

    _displayLoading() {
        if (this.state.isLoading) {
          // Si isLoading vaut true, on affiche le chargement à l'écran
          return (
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' />
            </View>
          )
        }
      }

      _displayFavoriteImage() {
        var sourceImage = require('../images/favo.png')
        if (this.props.favoriteFilms.findIndex(item => item.id === this.state.film.id) !== -1) {
          // Film dans nos favoris
          sourceImage = require('../images/favoN.png')
        }
        return (
          <Image
            style={styles.favorite_image}
            source={sourceImage}
          />
        )
    }

      _displayFilm(){
          const {film } = this.state
          if(film !== undefined){
              return (
                <ScrollView style={styles.scrollview_container}>
                <Image
                  style={styles.image}
                  source={{uri: getImageFromApi(film.backdrop_path)}}
                />
                <Text style={styles.title_text}>{film.title}</Text>
                      <TouchableOpacity
                          style={styles.favorite_container}
                          onPress={() => this._toggleFavorite()}>
                          {this._displayFavoriteImage()}
                    </TouchableOpacity>
                <Text style={styles.description_text}>{film.overview}</Text>
                <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                <Text style={styles.default_text}>Genre(s) : {film.genres.map(function(genre){
                    return genre.name;
                  }).join(" / ")}
                </Text>
                <Text style={styles.default_text}>Companie(s) : {film.production_companies.map(function(company){
                    return company.name;
                  }).join(" / ")}
                </Text>
              </ScrollView>
              )
          }


      }

     

    render(){
       // console.log(this.props)
        return(
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
                {this._displayActionButton()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex:1
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'

    },

    favorite_container: {
      alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
  },

  favorite_image: {
    width: 40,
    height: 40
},

    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
      },
      title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
      },
      description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
      },
      default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
      },

      share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
      },
      share_image: {
        width: 30,
        height: 30
      }

})

const mapStateToProps = (state) => {
  return {
    favoriteFilms: state.toggleFavorite.favoriteFilms
  }
}

export default connect(mapStateToProps) (FilmDetail)