package atividade.uninter;

public class Euro extends Moeda {
	
	public Euro (double valor) {
		this.valor = valor;
	}

	@Override
	public void info() {
		System.out.println("Euro - " + valor);
		
	}

	@Override
	public double converter() {
		return this.valor * 5.40;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this.getClass () != obj.getClass ()) {
			return false;
		}
		
		Euro objEuro = (Euro) obj;
		
		if (this.valor != objEuro.valor) {
			return false;
		}
		
		return true;
	}
	

}
