// Mesero
class Mesero {
  tomarPedido() {
    console.log('Pedido realizado');
  };

  notify() {
    this.tomarPedido();
  };
}

const mesero = new Mesero();

// Cocinero
class Cocinero {
  prepararComida() {
    console.log('Comida Preparada, lista para servir');
  };

  notify() {
    this.prepararComida();
  };
}

const cocinero = new Cocinero();

// Cajita registradora
class CajaRegistradora {
  cobrarPedido() {
    console.log("Pedido cobrado");
  }

  notify() {
    this.cobrarPedido();
  }
}

const caja = new CajaRegistradora();

// Orden
class Orden {
  constructor() {
    this.observers = [];
  }

  crearOrden() {
    this.notifyObservers();
  };

  suscribe(observer) {
    this.observers.push(observer);
  }

  remove(observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  notifyObservers() {
    this.observers.forEach(function(observer) {
      observer.notify();
    });
  }
}

const orden = new Orden();

// funcionalidad
orden.suscribe(mesero);
orden.suscribe(cocinero);
orden.suscribe(caja);

orden.crearOrden();


