package atividade.uninter;

public class Dolar extends Moeda {
	
	public Dolar (double valor) {
		this.valor = valor;
	}

	@Override
	public void info() {
		System.out.println("Dolar - " + valor);
		
	}

	@Override
	public double converter() {
		return this.valor * 4.80;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this.getClass () != obj.getClass ()) {
			return false;
		}
		
		Dolar objDolar = (Dolar) obj;
		
		if (this.valor != objDolar.valor) {
			return false;
		}
		
		return true;
	}
	

}
